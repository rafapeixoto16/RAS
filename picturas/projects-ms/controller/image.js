import { z } from 'zod';
import * as Image from '../models/imageModel';
import { buildPagination, buildSort, buildQuery } from '../models/queryImage';

export const imageSchema = z.object({
    uri: z.string().min(1, 'URI is required'),
    project_id: z.string().uuid('Invalid project ID'),
});

export const getImage = (id) => {
    return Image.findOne({ _id: id }).exec();
};

export const getImages = (query) => {
    const { page, limit, sort } = query;
    const pagination = buildPagination({ page, limit });
    const sortObject = buildSort(sort);
    const queryObject = buildQuery(query); // Assuming query can have fields like 'uri', 'project_id', etc.
    return Image.find(queryObject)
        .sort(sortObject)
        .skip(pagination.skip)
        .limit(pagination.limit)
        .exec();
};

export const addImage = (imageData) => {
    return new Image(imageData).save();
};

export const updateImage = (id, info) => {
    return Image.updateOne({ _id: id }, info).exec();
};

export const deleteImage = (id) => {
    return Image.deleteOne({ _id: id }).exec();
};

export const deleteAllImages = () => {
    return Image.deleteMany().exec();
};
