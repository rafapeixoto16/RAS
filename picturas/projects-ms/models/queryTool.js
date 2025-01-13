import { z } from 'zod';

export const queryToolSchema = schemaValidation.object({
    position: schemaValidation.number().optional(),
    parameters: schemaValidation.string().optional(),
    project_id: schemaValidation.string().optional(),
    _id: schemaValidation.string().optional(),
    limit: schemaValidation.number().optional().default(10),
    page: schemaValidation.number().optional().default(1),
    sort: z
        .object({
            position: schemaValidation.number().optional(),
            project_id: schemaValidation.number().optional(),
            _id: schemaValidation.number().optional(),
        })
        .optional(),
});

export const buildQuery = ({
    position,
    procedure,
    parameters,
    project_id,
    _id,
}) => {
    const query = {};

    if (position) {
        query.position = position;
    }

    if (procedure) {
        query.procedure = { $regex: procedure, $options: 'i' };
    }

    if (parameters) {
        query.parameters = { $regex: parameters, $options: 'i' };
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
        if (sort.position) sortObject.position = sort.position;
        if (sort.procedure) sortObject.procedure = sort.procedure;
        if (sort.parameters) sortObject.parameters = sort.parameters;
        if (sort.project_id) sortObject.project_id = sort.project_id;
        if (sort._id) sortObject._id = sort._id;
    }
    return sortObject;
};
