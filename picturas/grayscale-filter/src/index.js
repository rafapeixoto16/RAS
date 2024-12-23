import { createFilterHandler, schemaValidation } from '@picturas/filter-helper';
import sharp from 'sharp';

const grayscaleSchema = schemaValidation.object({
    brightness: schemaValidation.number().min(0).max(1).default(0.5),
});

async function grayscaleHandler(imageBuffer, params) {
    const { brightness } = params;

    return sharp(imageBuffer)
        .grayscale()
        .modulate({ brightness })
        .toBuffer();
}

createFilterHandler('grayscale', grayscaleSchema, grayscaleHandler);
