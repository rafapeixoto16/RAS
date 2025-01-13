import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { readFileSync } from 'fs';
import { fromJsonSchema } from '';

const baseSchemas = JSON.parse(
    readFileSync(
        resolve(dirname(fileURLToPath(import.meta.url)), '../schemas.json'),
        'utf-8'
    )
);

const schemas = Object.entries(schemas).reduce((acc, [filterName, { isPremium, schema }]) => {
    acc[filterName] = {
        isPremium,
        schema: fromJsonSchema(schema),
    };
    return acc;
}, {});

export default schemas;
