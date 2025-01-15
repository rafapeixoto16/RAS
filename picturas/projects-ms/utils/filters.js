import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { readFileSync } from 'fs';
import { fromJsonSchema } from '@picturas/schema-validation';

const baseSchemas = JSON.parse(
    readFileSync(
        resolve(dirname(fileURLToPath(import.meta.url)), '../schemas.json'),
        'utf-8'
    )
);

const schemas = Object.entries(baseSchemas).reduce((acc, [filterName, { isPremium, schema }]) => {
    acc[filterName] = {
        isPremium,
        schema: fromJsonSchema(filterName, schema),
    };
    return acc;
}, {});

export default schemas;
