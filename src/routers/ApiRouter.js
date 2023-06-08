import { Router } from 'express';
import HostRouter from './resources/HostRouter.js';
import PendingActionRouter from './resources/PendingActionRouter.js'

const router = Router();

router.use('/hosts', HostRouter);
router.use('/pending-actions', PendingActionRouter);

export default router;