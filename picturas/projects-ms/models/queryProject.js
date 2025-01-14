import {schemaValidation} from '@picturas/schema-validation';

export const queryProjectSchema = schemaValidation.object({
    name: schemaValidation.string().optional(),
    tool_filterName: schemaValidation.string().optional(),
    image_format: schemaValidation.enum(['png', 'jpg', 'jpeg', 'bmp', 'webp', 'tiff']).optional(),
    result_expireDate: schemaValidation.date().optional(), 
    _id: schemaValidation.string().optional(),
    limit: schemaValidation.number().optional().default(10),
    page: schemaValidation.number().optional().default(1),
    sort: schemaValidation.object({
            name: schemaValidation.number().optional(),
            _id: schemaValidation.number().optional(),
            'tools.filterName': schemaValidation.number().optional(),
            'images.format': schemaValidation.number().optional(),
            'result.expireDate': schemaValidation.number().optional(),
            createdAt: schemaValidation.date().optional(),
            updatedAt: schemaValidation.date().optional(),
        })
        .optional(),
});

// in case the model changes, we might need to update this function
export const buildQuery = ({ name, tool_filterName, image_format, result_expireDate, _id }) => {
    const query = {};

    if (name) {
        query.name = { $regex: name, $options: 'i' }; // Case-insensitive search
    }

    if (tool_filterName) {
        query['tools.filterName'] = { $regex: tool_filterName, $options: 'i' };
    }

    if (image_format) {
        query['images.format'] = image_format;
    }

    if (result_expireDate) {
        query['result.expireDate'] = { $gte: new Date(result_expireDate) };
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
        if (sort._id) sortObject._id = sort._id;
        if (sort['tools.filterName']) sortObject['tools.filterName'] = sort['tools.filterName'];
        if (sort['images.format']) sortObject['images.format'] = sort['images.format'];
        if (sort['result.expireDate']) sortObject['result.expireDate'] = sort['result.expireDate'];
        if (sort.createdAt) sortObject.createdAt = sort.createdAt;
        if (sort.updatedAt) sortObject.updatedAt = sort.updatedAt;
    }
    return sortObject;
};
