import { Router } from 'express';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { readFileSync } from 'fs';

const router = Router();

const schemas = JSON.parse(
    readFileSync(
        resolve(dirname(fileURLToPath(import.meta.url)), '../schemas.json'),
        'utf-8',
    ),
);

router.get('/', (req, res) => {
    res.json(schemas);
});

export default router;
