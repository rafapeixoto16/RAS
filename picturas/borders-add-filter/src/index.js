import { createFilterHandler, schemaValidation } from '@picturas/filter-helper';
import sharp from 'sharp';

// Define o esquema para as bordas
const borderSchema = schemaValidation.object({
    color: schemaValidation.string().default('#000000'), // Cor da borda, padrão preto
    size: schemaValidation.number().default(10), // Tamanho da borda em pixels
});

// Função handler para adicionar bordas
async function borderHandler(imageBuffer, _, params) {
    const { color, size } = params;

    // Carrega a imagem original
    const image = sharp(imageBuffer);

    // Obtém as dimensões da imagem original
    const { width, height } = await image.metadata();

    // Cria uma nova imagem com o fundo expandido para adicionar bordas
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

// Regista o handler
createFilterHandler('addBorder', borderSchema, borderHandler);
