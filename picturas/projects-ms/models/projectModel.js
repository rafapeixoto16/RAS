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

mongoose.connection.collection('Projects').watch([
    { $match: {operationType: 'delete'} }
]).on('change', async (change) => {
    const lock = await redisLock(redisClient, `delete_${change._id}`, 0);

    await minioClient.removeObjects(process.env.S3_IMAGE_BUCKET, change.images.map((img) => `${img.id}.${img.format}`));

    await lock();
});

export default Project;
