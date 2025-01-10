import { Router } from 'express';
import filtersRouter from './filters.js';
import proxy from 'express-http-proxy'

const router = Router();

router.use('/users', proxy('http://users-ms:3000'));
router.use('/filters', filtersRouter);

export default router;
