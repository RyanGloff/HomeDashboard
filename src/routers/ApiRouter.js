import { Router } from 'express';
import GenericRestRouter from './GenericRestRouter.js';
import RouterConfigs from './RouterConfigs.js';

const router = Router();

Object.keys(RouterConfigs)
    .forEach(endpoint => {
        const plural = RouterConfigs[endpoint].plural;
        router.use(`/${plural}`, GenericRestRouter.createGenericRestRouter(endpoint))
    });

export default router;