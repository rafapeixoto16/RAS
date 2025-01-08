import { createFilterHandler } from '@picturas/filter-helper';
import {schemaValidation} from "@picturas/schema-validation";
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import * as tf from '@tensorflow/tfjs-node';

const personCountSchema = schemaValidation.object({});

async function personCountHandler(imageBuffer, _, _params) {
    const model = await cocoSsd.load();
    const tensor = tf.node.decodeImage(imageBuffer, 3);
    const predictions = await model.detect(tensor);

    tensor.dispose();

    const results = predictions
        .filter((prediction) => prediction.class === 'person')
        .map((person) => ({
            boundingBox: person.bbox,
            score: person.score,
        }));

    const personCount = results.length;

    const output = {
        personCount,
        details: results,
    };

    const jsonOutput = JSON.stringify(output, null, 2);

    return [jsonOutput, 'json'];
}

createFilterHandler('person-count', personCountSchema, personCountHandler);
