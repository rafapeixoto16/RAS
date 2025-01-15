import mongoose from 'mongoose';

const limitsModel = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'userId' 
    },
    qtdRunnedPipelines: {
        type: Number,
        required: true,
    },
    ttl: {
        type: Date,
        default: Date.now(),
        required: true,
        index: { expires: '48h' }
    }
}, {
    timestamps: false
});

const Limits = mongoose.model('Limits', limitsModel); 
export default Limits;
