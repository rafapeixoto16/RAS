import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const SALT_WORK_FACTOR = 10;

const userSchema = new mongoose.Schema(
    {
        nome: { type: String, required: true },
        email: { type: String, required: true, unique: true, index: true },
        password: { type: String, required: true },
        username: { type: String, required: true, unique: true, index: true },
        profilePic: { type: String, default: null }, // URL da imagem 
        location: { type: String, required: true },
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
        emailPreferences: {
            projectUpdates: { type: Boolean, default: true },
            newFeatures: { type: Boolean, default: true },
            marketing: { type: Boolean, default: true },
            projectCollaborations: { type: Boolean, default: true },
            comments: { type: Boolean, default: true },
        },
    },
    { versionKey: false }
);

const User = mongoose.model('user', userSchema);

function bcryptEncripter(user, next) {
    if (!user.isModified('password')) return next();

    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) return next(err);

        return bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);
            user.password = hash;
            return next();
        });
    });
}

userSchema.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        if (err) return cb(err);
        return cb(null, isMatch);
    });
};


userSchema.methods.updateEmailPreferences = async function (preferences) {
    try {
        this.emailPreferences = {
            ...this.emailPreferences,
            ...preferences,
        };
        await this.save();
        return this.emailPreferences;

    } catch (err) {
        throw new Error("Erro ao atualizar preferências de email: " + err.message);
    }
};

userSchema.pre('save', function (next) {
    bcryptEncripter(this, next);
});

userSchema.pre('findOneAndUpdate', function (next) {
    bcryptEncripter(this, next);
});

export { User };
