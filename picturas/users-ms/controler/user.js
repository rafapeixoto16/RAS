import { User } from '../models/userModel.js';

export const getUser = id => {
    return User.findOne({ _id: id }).exec();
}

export const getUserByEmail = email => {
    return User.findOne({ email: email }).exec();
}

export const addUser = (u) => {
    return new User(u).save();
}

export const updateUser = (id, info) => {
    return User.updateOne({ _id: id }, info).exec();
}

export const updateUserPassword = (id, pwd) => {
    return User.updateOne({ _id: id }, pwd).exec();
}

export const deleteUser = id => {
    return User.deleteOne({ _id: id }).exec();
}

export const deleteAll = () => {
    return User.deleteMany().exec();
}
