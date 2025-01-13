import { z } from 'zod';

export const queryProjectSchema = schemaValidation.hemaValidation.object({
    name: schemaValidation.hemaValidation.string().optional(),
    tool_filterName: schemaValidation.hemaValidation.string()
    _id: schemaValidation.hemaValidation.string().optional(),
    limit: schemaValidation.hemaValidation.number().optional().default(10),
    page: schemaValidation.hemaValidation.number().optional().default(1),
    sort: z
        .object({
            name: schemaValidation.hemaValidation.number().optional(),
            user_id: schemaValidation.hemaValidation.number().optional(),
            _id: schemaValidation.hemaValidation.number().optional(),
        })
        .optional(),
});

// in case the model changes, we might need to update this function
export const buildQuery = ({ name, user_id, _id }) => {
    const query = {};

    if (name) {
        query.name = { $regex: name, $options: 'i' }; // Case-insensitive search for 'name'
    }

    if (user_id) {
        query.user_id = user_id;
    }

    if (_id) {
        query._id = _id;
    }

    return query;
};

export const buildPagination = ({ page, limit }) => ({
    skip: (page - 1) * limit,
    limit,
});

export const buildSort = (sort) => {
    const sortObject = {};
    if (sort) {
        if (sort.name) sortObject.name = sort.name;
        if (sort.user_id) sortObject.user_id = sort.user_id;
        if (sort._id) sortObject._id = sort._id;
    }
    return sortObject;
};
