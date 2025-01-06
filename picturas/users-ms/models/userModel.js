import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    username: { type: String, required: true, unique: true, index: true },
    location: { type: String, required: true },
}, { versionKey: false });

const User = mongoose.model('user', userSchema);

export {User}