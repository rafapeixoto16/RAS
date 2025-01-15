import amqp from 'amqplib';
import path from 'node:path';
import redisLock from './redisLock.js';
import redisClient from '../config/redisConfig.js';
import JSZip from 'jszip';
import fs from 'node:fs';

const {
    RABBITMQ_HOST,
    RABBITMQ_PORT,
    RABBITMQ_USERNAME,
    RABBITMQ_PASSWORD,
    FILTER_OUTPUT_QUEUE,
    NOTIFICATION_QUEUE,
} = process.env;

const RABBITMQ_URL = `amqp://${RABBITMQ_USERNAME}:${RABBITMQ_PASSWORD}@${RABBITMQ_HOST}:${RABBITMQ_PORT}`;
const BASE_PATH = path.resolve(process.env.FILTER_SHARED_DIR);

let channel;

function startProcessingOutputQueue() {
    if (!channel) {
        throw new Error('Channel is not initialized. Connect to RabbitMQ first.');
    }

    channel.consume(
        FILTER_OUTPUT_QUEUE,
        (msg) => {
            if (msg !== null) {
                console.log('message received')
                filterTerminated(msg.content.toString());
                channel.ack(msg);
            }
        },
        { noAck: false }
    );
}

export async function connectToRabbitMQ() {
    const connection = await amqp.connect(RABBITMQ_URL);
    channel = await connection.createChannel();

    await channel.assertQueue(FILTER_OUTPUT_QUEUE, { durable: true });
    await channel.assertQueue(NOTIFICATION_QUEUE, { durable: true });

    startProcessingOutputQueue();
}

async function sendMessage(queueName, message) {
    if (!channel) {
        throw new Error('Channel is not initialized. Connect to RabbitMQ first.');
    }

    console.log(queueName, typeof message, message)

    channel.sendToQueue(queueName, Buffer.from(message), {
        persistent: true,
    });
}

// It might suffer from FS delays, given the ennormeous ammount of files

// redis:
//  key: projectId
//   _lock: locks the struct
//   _meta: {userId, isPreview, extraUpload: [String]}
//   _cancel: if exists starts counter to filters.length and then message
//   _term: counter to filters.length and then finish (termination)
//   _filters: [filterInfo]
//   _images: images ids
//    _imageId: [imagePath]

// filterInfo: {filterName: string, filterProps: {}}

const hooks = {
    downloadResource: (projectId, imageInfo, path) => {},
    uploadResource: (userId, projectId, path, isPreview) => {},
    terminated: (projectId, uploadUrl) => {}
}

export function setHooks(downloadResource, uploadResource, terminated) {
    hooks.downloadResource = downloadResource;
    hooks.uploadResource = uploadResource;
    hooks.terminated = terminated;
}

function toMessageId(projectId, imageId, stage) {
    return `${stage}_${projectId}_${imageId}`;
}

function fromMessageId(messageId) {
    const splited = messageId.split('_');

    return {
        stage: Number(splited[0]),
        projectId: splited[1],
        imageId: splited[2]
    }
}

function getTempName(imageInfo, stage) {
    return path.join(BASE_PATH, `${stage}-${imageInfo.id}.${imageInfo.format}`);
}

function getTempNameStage(imagePath, stage) {
    const { dir, name, ext } = path.parse(imagePath);
    
    const regex = /^(\d+)-/;
    const newName = name.replace(regex, `${stage}-`);

    return path.format({ dir, name: newName, ext });
}

function getRedisKey(projectId, key, subkey=null) {
    const sub = subkey ? `_${subkey}` : '';
    return `${projectId}_${key}${sub}`
}

async function allocRedis(userId, projectId, isPreview, filterInfo, images) {
    await redisClient.set(getRedisKey(projectId, 'meta'), JSON.stringify({userId, isPreview, extraUpload: []}));
    await redisClient.set(getRedisKey(projectId, 'term'), 0);
    await redisClient.set(getRedisKey(projectId, 'filters'), JSON.stringify(filterInfo));
    await redisClient.set(getRedisKey(projectId, 'images'), JSON.stringify(images.map((info) => info.imageId)));

    for (let imageInfo of images) {
        await redisClient.set(getRedisKey(projectId, 'images', imageInfo.imageId), imageInfo.path);
    }
}

async function freeRedis(projectId) {
    await redisClient.del(getRedisKey(projectId, 'meta'));
    await redisClient.del(getRedisKey(projectId, 'term'));
    await redisClient.del(getRedisKey(projectId, 'cancel'));
    await redisClient.del(getRedisKey(projectId, 'filters'));

    const imagesKey = getRedisKey(projectId, 'images');
    const images = JSON.parse(await redisClient.get(imagesKey));
    await redisClient.del(imagesKey);

    for (let imageId of images) {
        await redisClient.del(getRedisKey(projectId, 'images', imageId));
    }
}

async function applyFilter(projectId, imageId, inPath, outPath, filterInfo, stage) {
    const msg = {
        messageId: toMessageId(projectId, imageId, stage),
        timestamp: Date.now(),
        procedure: filterInfo.filterName,
        parameters: {
            inputImageURI: inPath,
            outputImageURI: outPath,
            ...filterInfo.args
        }
    }

    await sendMessage(filterInfo.filterName, JSON.stringify(msg));
}

async function filterTerminated(msg) {
    console.log(msg)
    const data = JSON.parse(msg);
    const {projectId, imageId, stage} = fromMessageId(data.correlationId);

    const lock = await redisLock(getRedisKey(projectId, 'lock'));
    const cancelKey = getRedisKey(projectId, 'cancel');

    // Errors
    if (data.status === 'error') {
        const k = getRedisKey(projectId, 'meta');
        const dt = JSON.parse(await redisClient.get(k));
        await sendMessage(process.env.NOTIFICATION_QUEUE, JSON.stringify({userId: dt.userId, projectId, message: {kind: 'error', error: data.error}}));
        await redisClient.set(cancelKey, 0);
    }

    // Cancelation
    if (await redisClient.exists(cancelKey)) {
        const nImages = JSON.parse(await redisClient.get(getRedisKey(projectId, 'images'))).length;
        const cancelCount = Number(await redisClient.get(cancelKey)) + 1;

        if (nImages === cancelCount) {
            const k = getRedisKey(projectId, 'meta');
            const dt = JSON.parse(await redisClient.get(k));
            await sendMessage(process.env.NOTIFICATION_QUEUE, JSON.stringify({userId: dt.userId, projectId, message: {kind: 'canceled'}}));
            await hooks.terminated(projectId);
        } else {
            await redisClient.set(cancelKey, cancelCount);
        }

        await lock();
        return;
    }

    // Check if there is a next
    const filterInfoList = JSON.parse(await redisClient.get(getRedisKey(projectId, 'filters')));
    console.error(filterInfoList, filterInfoList.length, stage)
    const runNext = filterInfoList.length !== stage;

    // Update base image (deal with non image outputs)
    const key = getRedisKey(projectId, 'images', imageId);
    let inPath = await redisClient.get(key);
    let outPath = getTempNameStage(inPath, stage + 1);

    if (data.output.type === 'image') {
        fs.unlinkSync(inPath);
        inPath = getTempNameStage(inPath, stage);
        await redisClient.set(key, inPath);
    } else if (data.output.type === 'text') {
        const k = getRedisKey(projectId, 'meta');
        const dt = JSON.parse(await redisClient.get(k));
        dt.extraUpload.push(data.output.imageURI);
        await redisClient.set(k, JSON.stringify(dt));
    }
    
    // Next stage        
    if (runNext) {
        await applyFilter(projectId, imageId, inPath, outPath, filterInfoList[stage], stage + 1);
    } else {
        // Termination
        const termKey = getRedisKey(projectId, 'term');
        const allImages = JSON.parse(await redisClient.get(getRedisKey(projectId, 'images')));
        const nImages = allImages.length;
        const termCount = Number(await redisClient.get(termKey)) + 1;

        console.log('hello1', allImages)

        if (nImages === termCount) {
            const k = getRedisKey(projectId, 'meta');
            const dt = JSON.parse(await redisClient.get(k));
            let upload = dt.extraUpload;

            for (let image of allImages) {
                upload.push(await redisClient.get(getRedisKey(projectId, 'images', image)));
            }

            upload = Array.from(new Set(upload));

            // Create zip & upload
            const zip = new JSZip();

            console.error(upload)

            for (const file of upload) {
                const fileData = fs.readFileSync(file);
                zip.file(file, fileData);
            }

            const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });
            const uploadUrl = await hooks.uploadResource(dt.userId, projectId, zipBuffer, dt.isPreview);

            // Delete temporary files
            for (let file of upload) fs.unlinkSync(file);

            await freeRedis(projectId);

            await sendMessage(process.env.NOTIFICATION_QUEUE, JSON.stringify({userId: dt.userId, projectId, message: {kind: 'finished', url: uploadUrl}}));
            await hooks.terminated(projectId, uploadUrl);
        } else {
            await redisClient.set(termKey, termCount);
        }
    }

    await lock();
}

async function runPipelineInternal(userId, projectId, imageInfoList, filterInfoList, applyWatermark, isPreview) {
    // TODO if (applyWatermark) filterInfoList.push({filterName: 'watermark', args: {}});

    const images = [];

    for (let i = 0; i < imageInfoList.length; i++) {
        const imageInfo = imageInfoList[i];

        const tempName = getTempName(imageInfo, 0);
        await hooks.downloadResource(projectId, imageInfo, tempName);
        
        images.push({imageId: imageInfo.id, path: tempName});
    }

    await allocRedis(userId, projectId, isPreview, filterInfoList, images);

    for (let image of images) {
        await applyFilter(projectId, image.imageId, image.path, getTempNameStage(image.path, 1), filterInfoList[0], 1);
    }
}

export async function cancelPipeline(projectId) {
    const lock = await redisLock(getRedisKey(projectId, 'lock'));
    await redisClient.set(getRedisKey(projectId, 'cancel'), 0);
    await lock();
}

export async function runPipeline(userId, projectId, imageInfoList, filterInfoList, applyWatermark) {
    await runPipelineInternal(userId, projectId, imageInfoList, filterInfoList, applyWatermark, false);
}

export async function runPreview(userId, projectId, imageInfo, filterInfo, applyWatermark) {
    await runPipelineInternal(userId, projectId, [imageInfo], [filterInfo], applyWatermark, true);
}
