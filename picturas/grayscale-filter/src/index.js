import { createFilterHandler, schemaValidation } from '@picturas/filter-helper';
import sharp from 'sharp';

const grayscaleSchema = schemaValidation.object({});

async function grayscaleHandler(imageBuffer, _, _params) {
    return sharp(imageBuffer)
        .grayscale()
        .toBuffer();
}

createFilterHandler('grayscale', grayscaleSchema, grayscaleHandler);
