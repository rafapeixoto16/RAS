import { createFilterHandler, schemaValidation } from '@picturas/filter-helper';
import sharp from 'sharp';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import * as tf from '@tensorflow/tfjs-node';

const smartCropSchema = schemaValidation.object({
    object: schemaValidation.string().default('person'),
});

const classMap = {
    pessoa: 'person',
    cão: 'dog',
    gato: 'cat',
    carro: 'car',
    bicicleta: 'bicycle',
    avião: 'airplane',
    autocarro: 'bus',
    comboio: 'train',
    cavalo: 'horse',
    ovelha: 'sheep',
    vaca: 'cow',
    passaro: 'bird',
    'cachorro quente': 'hot dog',
    pizza: 'pizza',
    porta: 'door',
    janela: 'window',
    cadeira: 'chair',
    mesa: 'table',
    garrafa: 'bottle',
    livro: 'book',
    computador: 'laptop',
    telefone: 'cell phone',
    refrigerante: 'soda',
    sapatilhas: 'sneaker',
    bolsa: 'handbag',
};

function translateClass(className) {
    return classMap[className] || className;
}

async function smartCropHandler(imageBuffer, _, params) {
    const { object } = params;

    // fixme encontrar alguma api que traduza a palavra para ingles
    const objEnglish = translateClass(object);

    const model = await cocoSsd.load();

    const tensor = tf.node.decodeImage(imageBuffer, 3);
    const predictions = await model.detect(tensor);

    const target = predictions.find(
        (pred) => pred.class === objEnglish && pred.score >= 0.5
    );

    tensor.dispose();

    if (!target) {
        return {
            error: '404',
            message: `Nenhum objeto "${objEnglish}" foi detectado.`,
        };
    }

    const { bbox } = target;
    const [x, y, width, height] = bbox.map((v) => Math.max(Math.floor(v), 0));

    return sharp(imageBuffer)
        .extract({
            left: x,
            top: y,
            width,
            height,
        })
        .toBuffer();
}

createFilterHandler('smart-crop', smartCropSchema, smartCropHandler);
