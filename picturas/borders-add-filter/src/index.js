import { createFilterHandler, schemaValidation } from '@picturas/filter-helper';
import sharp from 'sharp';

// esquema para as bordas
const borderSchema = schemaValidation.object({
    //color: schemaValidation.string().default('#FFFFFF'), // cor da borda, default branco (passar pra preto -> #000000')
    color: schemaValidation.string().default('#000000'), 
    size: schemaValidation.number().default(100), // tamanho da borda
});

// funcao handler para adicionar bordas
async function borderHandler(imageBuffer, _, params) {
    const { color, size } = params;

    // carrega a imagem original
    const image = sharp(imageBuffer);

    // dimensoes da imagem original
    const { width, height } = await image.metadata();

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
