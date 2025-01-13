import mongoose from 'mongoose';

const subcriptionSchema = new mongoose.Schema({
        userId: {type: mongoose.Types.ObjectId, unique: true, required: true},
        premium: {type: Boolean, required: true, default: false},
        plan: {
            type: String,
            enum: ['regular', 'monthly', 'yearly'],
            default: 'regular',
        },
        trialUsed: {type: Boolean, required: true, default: false},
        stripeId: {type: String, required: true, unique: true, index: true},
        subscriptionId:{type: String, default: null}
    },
    {versionKey: false});

const Subscription = mongoose.model('subscription', subcriptionSchema);

export default Subscription;
