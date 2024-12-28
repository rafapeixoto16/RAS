import { createFilterHandler, schemaValidation } from '@picturas/filter-helper';
import sharp from 'sharp';

const contrastSchema = schemaValidation.object({
    contrast: schemaValidation.number().default(1),
});

async function contrastHandler(imageBuffer, _, params) {
    const { contrast } = params;

    const slope = contrast;
    const intercept = (1 - contrast) * 128;

    return sharp(imageBuffer).linear(slope, intercept).toBuffer();
}

createFilterHandler('contrast', contrastSchema, contrastHandler);
