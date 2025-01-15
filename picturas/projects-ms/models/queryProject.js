import {schemaValidation} from '@picturas/schema-validation';

export const queryProjectSchema = schemaValidation.object({
    name: schemaValidation.string().optional(),
    tool_filterName: schemaValidation.string().optional(),
    image_format: schemaValidation.enum(['png', 'jpg', 'jpeg', 'bmp', 'webp', 'tiff']).optional(),
    limit: schemaValidation.number().optional().default(10),
    page: schemaValidation.number().optional().default(1),
    sort: schemaValidation.string().regex(/^(name|tool_filterName|image_format|limit|page|createdAt|updatedAt)$/).optional(),
    order: schemaValidation.enum(['asc', 'desc']).optional().default('asc')
}).strict().optional();


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

    return query;
};

export const buildPagination = ({ page, limit }) => ({
    skip: (page - 1) * limit,
    limit,
});

export const buildSort = (sort, order) => {
    const names = {
        name: 'name',
        tool_filterName: 'tool.filterName',
        image_format: 'image.format',
        limit: 'limit',
        page: 'page',
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    }

    const sortObject = {};
    
    if (sort) {
        sortObject[names[sort]] = (!order || order === 'asc') ? 1 : -1;
    }

    return sortObject;
};
