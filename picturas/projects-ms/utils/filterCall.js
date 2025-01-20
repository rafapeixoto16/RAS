import amqp from 'amqplib';
import path from 'node:path';
import redisLock from './redisLock.js';
import redisClient from '../config/redisConfig.js';

const {
    RABBITMQ_HOST,
    RABBITMQ_PORT,
    RABBITMQ_USERNAME,
    RABBITMQ_PASSWORD,
    NOTIFICATION_QUEUE,
} = process.env;

const RABBITMQ_URL = `amqp://${RABBITMQ_USERNAME}:${RABBITMQ_PASSWORD}@${RABBITMQ_HOST}:${RABBITMQ_PORT}`;
const BASE_PATH = path.resolve(process.env.FILTER_SHARED_DIR);

let channel;

export async function connectToRabbitMQ() {
    const connection = await amqp.connect(RABBITMQ_URL);
    channel = await connection.createChannel();

    await channel.assertQueue(NOTIFICATION_QUEUE, { durable: true });
}

async function sendMessage(queueName, message) {
    if (!channel) {
        throw new Error('Channel is not initialized. Connect to RabbitMQ first.');
    }

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
    downloadResource: (projectId, imageInfo, path) => {}
}

export function setHooks(downloadResource) {
    hooks.downloadResource = downloadResource;
}

function toMessageId(projectId, imageId, stage) {
    return `${stage}_${projectId}_${imageId}`;
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

async function runPipelineInternal(userId, projectId, imageInfoList, filterInfoList, applyWatermark, isPreview) {
    if (applyWatermark) filterInfoList.push({filterName: 'watermark', args: {}});

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

export async function runPreview(userId, projectId, imageInfo, filterInfoList, applyWatermark) {
    await runPipelineInternal(userId, projectId, [imageInfo], filterInfoList, applyWatermark, true);
}
