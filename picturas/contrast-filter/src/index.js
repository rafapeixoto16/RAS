import { createFilterHandler, schemaValidation } from '@picturas/filter-helper';
import sharp from 'sharp';

const contrastSchema = schemaValidation.object({
    contrast: schemaValidation.number().default(1),
});

async function contrastHandler(imageBuffer, params) {
    const { contrast } = params;

    const slope = contrast;
    const intercept = (1 - slope) * 128; // fixme verify

    return sharp(imageBuffer).linear(slope, intercept).toBuffer();
}

createFilterHandler('contrast', contrastSchema, contrastHandler);
