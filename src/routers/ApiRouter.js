import { Router } from 'express';
import GenericRestRouter from './GenericRestRouter.js';
import RouterConfigs from './RouterConfigs.js';

const router = Router();

Object.keys(RouterConfigs)
    .forEach(endpoint => router.use(`/${endpoint}`, GenericRestRouter.createGenericRestRouter(endpoint)));

export default router;