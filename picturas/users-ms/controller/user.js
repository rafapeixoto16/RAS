import User from '../models/userModel.js';

export const getUser = (id) => {
    return User.findOne({ _id: id }).exec();
};

export const getUserByEmail = (email) => {
    return User.findOne({ email }).exec();
};

export const addUser = (u) => {
    return new User(u).save();
};

export const updateUser = (id, info) => {
    return User.findOneAndUpdate({ _id: id }, info).exec();
};

export const updateUserPassword = (id, pwd) => {
    return User.findOneAndUpdate({ _id: id }, {password: pwd}).exec(); // excute
};

export const updateUserProfilePic = (id, profilePicUrl) => {
    return User.findOneAndUpdate({ _id: id }, { profilePic: profilePicUrl }).exec();
};

export const deleteUser = (id) => {
    return User.deleteOne({ _id: id }).exec();
};

export const deleteAll = () => {
    return User.deleteMany().exec();
};

// (sotf) delete an account
export const softDeleteUser = (id) => {
    return User.findOneAndUpdate({ _id: id, deletedAt: { $exists: false } }, { deletedAt: new Date() }).exec();
};
// Recover a (soft) deleted account
export const recoverUser = (id) => {
    return User.findOneAndUpdate({ _id: id, deletedAt: { $exists: true } }, { deletedAt: null }).exec();
};