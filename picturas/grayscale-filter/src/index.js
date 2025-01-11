import { createFilterHandler } from '@picturas/filter-helper';
import { schemaValidation } from '@picturas/schema-validation';
import sharp from 'sharp';

const grayscaleSchema = schemaValidation.object({});

async function grayscaleHandler(imageBuffer, _, _params) {
    return sharp(imageBuffer).grayscale().toBuffer();
}

createFilterHandler('grayscale', grayscaleSchema, grayscaleHandler);
