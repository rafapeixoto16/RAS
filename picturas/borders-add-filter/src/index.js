import { createFilterHandler } from '@picturas/filter-helper';
import { schemaValidation } from '@picturas/schema-validation';
import sharp from 'sharp';

// Esquema para as bordas
const borderSchema = schemaValidation.object({
    color: schemaValidation
        .string()
        .regex(/^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/, {
            message:
                'Color must be a valid hex code in the format #RRGGBB or #RGB',
        })
        .default('#000000'), // cor da borda, default preto
    size: schemaValidation.number().default(100), // tamanho da borda
});

// funcao handler para adicionar bordas
async function borderHandler(imageBuffer, _, params) {
    const { color, size } = params;

    // carrega a imagem original
    const image = sharp(imageBuffer);

    // cria uma nova imagem com o fundo expandido para adicionar bordas
    return image
        .extend({
            top: size,
            bottom: size,
            left: size,
            right: size,
            background: color, // Cor da borda
        })
        .toBuffer();
}

// regista o handler
createFilterHandler('addBorder', borderSchema, borderHandler);
