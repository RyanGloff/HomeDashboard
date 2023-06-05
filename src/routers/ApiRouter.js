import { Router } from 'express';
import DeviceRouter from './resources/DeviceRouter.js';
import PendingActionRouter from './resources/PendingActionRouter.js'

const router = Router();

router.use('/devices', DeviceRouter);
router.use('/pending-actions', PendingActionRouter);

export default router;