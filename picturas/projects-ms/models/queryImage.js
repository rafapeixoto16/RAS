import { z } from 'zod';

export const queryImageSchema = z.object({
    uri: z.string().optional(),
    project_id: z.string().optional(),
    _id: z.string().optional(),
    limit: z.number().optional().default(10),
    page: z.number().optional().default(1),
    sort: z
        .object({
            uri: z.number().optional(),
            project_id: z.number().optional(),
            _id: z.number().optional(),
        })
        .optional(),
});

// In case the model changes, we might need to update this function
export const buildQuery = ({ uri, project_id, _id }) => {
    const query = {};

    if (uri) {
        query.uri = { $regex: uri, $options: 'i' }; // Case-insensitive search for 'uri'
    }

    if (project_id) {
        query.project_id = project_id;
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
        if (sort.uri) sortObject.uri = sort.uri; // Sort by uri
        if (sort.project_id) sortObject.project_id = sort.project_id; // Sort by project_id
        if (sort._id) sortObject._id = sort._id; // Sort by _id
    }
    return sortObject;
};
