import mongoose from 'mongoose';

/*
const subcriptionSchema = new mongoose.Schema( //TODO verify
    {
        email: { type: String, required: true, index: true },
        priceMonth : { type: Number, required: true, default: 999 },
        discont : { type: Number, required: true },
        price : { type: Number, required: true },
        interval : { type: String, required: true, default:'month' },
        date: { type: Date, required: true },
        paymentMethodId: { type: String, required: true },
        //autoRenewable: { type: Boolean, required: true, default: false },
    },
    { versionKey: false }
);*/
const subcriptionSchema = new mongoose.Schema({
    email: { type: String, unique: true, required: true },
    premium: { type: Boolean, required: true, default: false },
    plan: {
        type: String,
        enum: ['regular', 'monthly', 'yearly'],
        default: 'regular',
    },
    trialUsed: { type: Boolean, required: true, default: false },
    stripeId: { type: String, required: false, unique: true },
});

const Subscription = mongoose.model('subscription', subcriptionSchema);
export { Subscription };
