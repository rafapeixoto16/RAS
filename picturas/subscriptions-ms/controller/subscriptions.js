import Subscription from '../models/subscriptionModel.js';

export const getSubcriptionByUserId = (id) => {
    return Subscription.findOne({ userId: id }).exec();
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

export const updateSubcriptionByUserId = (id, info) => {
    return Subscription.updateOne({ userId: id }, info).exec();
};

export const deleteSubcription = (id) => {
    return Subscription.deleteOne({ _id: id }).exec();
};

export const deleteSubcriptionByUserId = (id) => {
    return Subscription.deleteOne({ userId: id }).exec();
};

export const deleteAll = () => {
    return Subscription.deleteMany().exec();
};
