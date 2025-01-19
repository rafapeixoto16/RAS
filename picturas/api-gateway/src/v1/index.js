import { Router } from 'express';
import filtersRouter from './filters.js';
import {checkAuthToken} from "../auth/auth.js";
import proxyAuthRequest from "../utils/proxy.js";

const router = Router();

router.use('/filters', filtersRouter);

router.use(checkAuthToken); // Auth

// Proxy to microservices
router.use('/user', proxyAuthRequest(`http://${process.env.USERS_MS}:${process.env.USERS_MS_PORT}`));
router.use('/subscription', proxyAuthRequest(`http://${process.env.SUBSCRIPTIONS_MS}:${process.env.SUBSCRIPTIONS_MS_PORT}`));
router.use('/project', proxyAuthRequest(`http://${process.env.PROJECTS_MS}:${process.env.PROJECTS_MS_PORT}`));

export default router;
