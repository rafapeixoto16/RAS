import { createFilterHandler } from '@picturas/filter-helper';
import { schemaValidation } from '@picturas/schema-validation';
import sharp from 'sharp';

// Permitir ao utilizador melhorar a imagem de forma rápida e eficaz,
// ajustando automaticamente o brilho, contraste, e saturação.

// define o schema pro ajuste automático
const autoAdjustSchema = schemaValidation.object({
    brightness: schemaValidation.number().default(1.2), // Aumenta brilho, 20% por default
    // contrast: schemaValidation.number().default(1.1),	// Aumenta contraste, 10% por default
    contrast: schemaValidation.number().default(10), // Aumenta contraste, 10% por default
    saturation: schemaValidation.number().default(1.3), // Aumenta saturacao, 30% por default
});

// Função handler para ajuste automático
async function autoAdjustHandler(imageBuffer, _, params) {
    const { brightness, saturation, contrast } = params;

    return sharp(imageBuffer)
        .modulate({
            brightness,
            saturation,
            contrast,
        })
        .toBuffer();
}

// Regista o handler
createFilterHandler('autoAdjust', autoAdjustSchema, autoAdjustHandler);
