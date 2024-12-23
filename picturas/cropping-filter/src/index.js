import { createFilterHandler, schemaValidation } from '@picturas/filter-helper';
import sharp from 'sharp';

const croppingSchema = schemaValidation.object({
    width: schemaValidation.number().min(1).required(),
    height: schemaValidation.number().min(1).required(),
    left: schemaValidation.number().min(0).default(0),
    top: schemaValidation.number().min(0).default(0),
});

async function croppingHandler(imageBuffer, _, params) {
    const { width, height, left, top } = params;

    return sharp(imageBuffer)
        .extract({
            left,
            top,
            width,
            height,
        })
        .toBuffer();
}

createFilterHandler('cropping', croppingSchema, croppingHandler);
