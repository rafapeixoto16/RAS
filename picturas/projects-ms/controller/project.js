import { z } from 'zod';
import * as Project from '../models/projectModel.js';
import {
    buildPagination,
    buildSort,
    buildQuery,
} from '../models/queryProject.js';

export const projectSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    user_id: z.string().uuid('Invalid user ID'), // Assuming user_id is stored as a UUID (adjust as needed if using ObjectId)
});

export const getProject = (id) => {
    return Project.findOne({ _id: id }).exec();
};

export const getProjects = (query) => {
    const { page, limit, sort } = query;
    const pagination = buildPagination({ page, limit });
    const sortObject = buildSort(sort);
    const queryObject = buildQuery(query);
    return Project.find(queryObject)
        .sort(sortObject)
        .skip(pagination.skip)
        .limit(pagination.limit)
        .exec();
};

export const addProject = (u) => {
    return new Project(u).save();
};

export const updateProject = (id, info) => {
    return Project.updateOne({ _id: id }, info).exec();
};

export const deleteProject = (id) => {
    return Project.deleteOne({ _id: id }).exec();
};

export const deleteAllProjects = () => {
    return Project.deleteMany().exec();
};
