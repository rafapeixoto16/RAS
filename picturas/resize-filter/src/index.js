import { createFilterHandler, schemaValidation } from '@picturas/filter-helper';
import sharp from 'sharp';

const resizeSchema = schemaValidation.object({
    width: schemaValidation.number().min(1).required(),
    height: schemaValidation.number().min(1).required(),
});

async function resizeHandler(imageBuffer, params) {
    const { width, height } = params;

    return sharp(imageBuffer)
        .resize(width, height, {
            fit: sharp.fit.fill,
            withoutEnlargement: true,
        })
        .toBuffer();
}

createFilterHandler('resize', resizeSchema, resizeHandler);
