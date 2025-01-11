import { Subscription } from '../models/subscriptionModel.js';

export const getSubcriptionByEmail = (email) => {
    return Subscription.findOne({ email: email }).exec();
};

export const getSubcriptionById = (id) => {
    return Subscription.findOne({ _id: id }).exec();
};

export const addSubcription = (u) => {
    return new Subscription(u).save();
};

export const updateSubcription = (id, info) => {
    return Subscription.updateOne({ _id: id }, info).exec();
};

export const updateSubcriptionByEmail = (email, info) => {
    return Subscription.updateOne({ email: email }, info).exec();
};

export const deleteSubcription = (id) => {
    return Subscription.deleteOne({ _id: id }).exec();
};

export const deleteSubcriptionByEmail = (email) => {
    return Subscription.deleteOne({ email: email }).exec();
};

export const deleteAll = () => {
    return Subscription.deleteMany().exec();
};
