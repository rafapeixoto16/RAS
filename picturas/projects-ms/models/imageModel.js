import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Image'
    },
    url: {
        type: String,
        required: true
    },
    ttl: {
        type: Date,
        default: Date.now(),
        required: true,
        index: { expires: '48h' }
    }
});

const Image = mongoose.model('Image', imageSchema); 
export default Image;
