import { createFilterHandler } from '@picturas/filter-helper';
import { schemaValidation } from '@picturas/schema-validation';
import sharp from 'sharp';

const saturationSchema = schemaValidation.object({
    saturation: schemaValidation.number().min(0).default(1),
});

async function saturationHandler(imageBuffer, _, params) {
    const { saturation } = params;

    return sharp(imageBuffer).modulate({ saturation }).toBuffer();
}

createFilterHandler('saturation', false, saturationSchema, saturationHandler);
