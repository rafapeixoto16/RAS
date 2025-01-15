import mongoose from 'mongoose';
import redisClient from '../config/redisConfig.js';
import minioClient from '../config/minioClient.js';
import redisLock from '../utils/redisLock.js';

const projectSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    tools: [{
        filterName: {
            type: String,
            required: true
        },
        args: {
            type: mongoose.Schema.Types.Mixed,
            required: true
        }
    }],
    images: [{
        id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        format: {
            type: String,
            enum: ['png', 'jpg', 'jpeg', 'bmp', 'webp', 'tiff'],
            required: true
        }
    }],
    result: {
        expireDate: {
            type: Date,
            required: false
        },
        output: {
            type: String,
            required: false
        },
    },
    ttl: {
        type: Date,
        default: null,
        required: false,
        index: { expires: '48h' }
    }
}, {
    timestamps: true
});

const Project = mongoose.model('Project', projectSchema);

async function listObjectsPromise(bucketName, prefix, recursive) {
    return new Promise((resolve, reject) => {
        const files = [];
        const stream = minioClient.listObjects(bucketName, prefix, recursive);
        stream.on('data', (data) => {
            files.push(data.name);
        });
        stream.on('end', () => resolve(files));
        stream.on('error', (err) => reject(err));
    });
}

Project.watch([
    { $match: {operationType: 'delete'} }
]).on('change', async (change) => {
    console.log(change.documentKey._id)

    const lock = await redisLock(change.documentKey._id, 0);

    const files = await listObjectsPromise(process.env.S3_PICTURE_BUCKET, change.documentKey._id.toString(), true);
    await minioClient.removeObjects(process.env.S3_PICTURE_BUCKET, files);

    await lock();
});

export default Project;
