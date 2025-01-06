import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

let SALT_WORK_FACTOR = 10

const userSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    username: { type: String, required: true, unique: true, index: true },
    location: { type: String, required: true },
    bio: { type: String, required: false },
    refresh: {type: String, required: false},
    active: { type: Boolean, default: false },
}, { versionKey: false });

const User = mongoose.model('user', userSchema);

function bcryptEncripter(user, next) {
    if (!user.isModified('password'))
        return next();

    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
}

userSchema.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

userSchema.pre('save', function (next) {
    bcryptEncripter(this, next);
});

userSchema.pre('findOneAndUpdate', function (next) {
    bcryptEncripter(this, next);
});

export {User}