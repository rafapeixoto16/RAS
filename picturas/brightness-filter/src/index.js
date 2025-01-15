import { createFilterHandler } from '@picturas/filter-helper';
import { schemaValidation } from '@picturas/schema-validation';
import sharp from 'sharp';

const brightnessSchema = schemaValidation.object({
    brightness: schemaValidation.number().min(0).default(1),
});

async function brightnessHandler(imageBuffer, _, params) {
    const { brightness } = params;

    return sharp(imageBuffer).modulate({ brightness }).toBuffer();
}

createFilterHandler('brightness', false, brightnessSchema, brightnessHandler);
