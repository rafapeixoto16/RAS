import mongoose from 'mongoose';

const subcriptionSchema = new mongoose.Schema( //TODO verify
    {
        email: { type: String, required: true, index: true },
        priceMonth : { type: Number, required: true, default: 10 }, //fixme valor base
        descont : { type: Number, required: true },
        price : { type: Number, required: true },
        duration : { type: Number, required: true },
        date: { type: Date, required: true },
        autoRenewable: { type: Boolean, required: true, default: false },
    },
    { versionKey: false }
);

const Subscription = mongoose.model('subscription', subcriptionSchema);
export { Subscription };