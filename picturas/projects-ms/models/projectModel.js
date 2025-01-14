import mongoose from 'mongoose';

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
export default Project;
