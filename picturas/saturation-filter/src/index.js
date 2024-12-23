import { createFilterHandler, schemaValidation } from '@picturas/filter-helper';
import sharp from 'sharp';

const saturationSchema = schemaValidation.object({
    saturation: schemaValidation.number().min(0).default(1),
});

async function saturationHandler(imageBuffer, params) {
    const { saturation } = params;

    return sharp(imageBuffer).modulate({ saturation }).toBuffer();
}

createFilterHandler('saturation', saturationSchema, saturationHandler);
