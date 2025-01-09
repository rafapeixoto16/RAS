import { createFilterHandler } from '@picturas/filter-helper';
import {schemaValidation} from "@picturas/schema-validation";
import { transparentBackground } from 'transparent-background';

const removeBgSchema = schemaValidation.object({
    fast: schemaValidation.boolean().default(false),
});

async function removeBgHandler(imageBuffer, inputFormat, params) {
    const { fast } = params;

    return transparentBackground(imageBuffer, inputFormat, {
        fast,
    });
}

createFilterHandler('remove-bg', removeBgSchema, removeBgHandler);
