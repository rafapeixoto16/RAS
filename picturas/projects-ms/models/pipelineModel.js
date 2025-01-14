import mongoose from 'mongoose';

const pipelineModel = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'userId' 
    },
    projects: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Project'
    }]
}, {
    timestamps: false
});

const Pipeline = mongoose.model('Pipeline', pipelineModel); 
export default Pipeline;
