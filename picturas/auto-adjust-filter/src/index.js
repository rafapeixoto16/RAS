import { createFilterHandler, schemaValidation } from '@picturas/filter-helper';
import sharp from 'sharp';

// Define o esquema para ajuste automático
const autoAdjustSchema = schemaValidation.object({
    brightness: schemaValidation.number().default(1.2), // Aumenta brilho em 20% por padrão
    saturation: schemaValidation.number().default(1.3), // Aumenta saturação em 30% por padrão
    hue: schemaValidation.number().default(0), // Matiz sem alteração por padrão
});

// Função handler para ajuste automático
async function autoAdjustHandler(imageBuffer, _, params) {
    const { brightness, saturation, hue } = params;

    // Aplica o método modulate para ajustar brilho, saturação e matiz
    return sharp(imageBuffer)
        .modulate({
            brightness: brightness,
            saturation: saturation,
            hue: hue, // Hue é medido em graus (0-360)
        })
        .toBuffer();
}

// Regista o handler
createFilterHandler('autoAdjust', autoAdjustSchema, autoAdjustHandler);
