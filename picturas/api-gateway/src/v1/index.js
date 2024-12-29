import { Router } from 'express';
import * as filtersRouter from './filters';

const router = Router();

router.get('/', (req, res) => {
    res.send('Hello World!');
});

router.use('/filters', filtersRouter);

export default router;
