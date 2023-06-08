import { Router } from 'express';
import GenericRestRouter from './GenericRestRouter.js';

const router = Router();

router.use('/hosts', GenericRestRouter.createGenericRestRouter('host'));
router.use('/controllers', GenericRestRouter.createGenericRestRouter('controller'));
router.use('/pending-actions', GenericRestRouter.createGenericRestRouter('pending-action'));

export default router;