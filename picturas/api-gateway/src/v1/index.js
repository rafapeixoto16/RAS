import { Router } from 'express';
import filtersRouter from './filters.js';

const router = Router();

router.use('/filters', filtersRouter);

export default router;
