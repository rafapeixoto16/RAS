import { Router } from 'express';
import filtersRouter from './filters.js';
import {checkAuthToken} from "../auth/auth.js";
import proxyAuthRequest from "../utils/proxy.js";

const router = Router();

router.use('/filters', filtersRouter);

router.use(checkAuthToken); // Auth

// Proxy to microservices
router.use('/users', proxyAuthRequest('http://users-ms:3000')); // TODO endpoint though environments

export default router;
