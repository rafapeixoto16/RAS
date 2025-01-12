import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true, index: true },
        password: { type: String, required: true },
        username: { type: String, required: true, unique: true, index: true },
        profilePic: { type: String, default: null }, // URL da imagem
        location: { type: String, required: false },
        bio: { type: String, required: false },
        refresh: { type: String, required: false },
        active: { type: Boolean, default: false },
        otpSecret: {
            type: String,
            required: false,
        },
        otpEnabled: {
            type: Boolean,
            default: false,
        },
        expireAt: {
            type: Date,
            default: Date.now,
            required: false,
            index: { expires: '24h' },
        },
    },
    { versionKey: false }
);

const User = mongoose.model('user', userSchema);

export default User;
