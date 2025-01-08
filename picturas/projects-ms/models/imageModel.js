import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema(
    {
        uri: {
            type: String,
            required: true,
        },
        project_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: true,
        },
    },
    { versionKey: false }
);

const Image = mongoose.model('image', imageSchema);

export { Image as Project };
