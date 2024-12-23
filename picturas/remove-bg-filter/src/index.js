import { createFilterHandler, schemaValidation } from '@picturas/filter-helper';
import { transparentBackground } from 'transparent-background';

const removeBgSchema = schemaValidation.object({
    fast: schemaValidation.boolean().default(false),
    fileExtension: schemaValidation.string().default('jpg'),
});

async function removeBgHandler(imageBuffer, params) {
    const { fast, fileExtension } = params;

    return transparentBackground(imageBuffer, fileExtension, {
        fast,
    });
}

createFilterHandler('remove-bg', removeBgSchema, removeBgHandler);
