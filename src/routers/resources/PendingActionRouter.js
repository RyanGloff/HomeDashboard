import GenericRestRouter from '../GenericRestRouter.js';
import Joi from 'joi';

const PENDING_ACTION_STATES = ['pending', 'inprogress', 'complete'];

const joiPostSchema = Joi.object({
    type: Joi.valid('Discover', 'ChangeState').required(),
    device: Joi.string().required(),
    state: Joi.valid(... PENDING_ACTION_STATES),
    additionalData: Joi.string()
});

const router = GenericRestRouter.createGenericRestRouter({
    typeName: 'pending-actions',
    removedMethods: [ GenericRestRouter.SupportedMethods.PATCH, GenericRestRouter.SupportedMethods.PUT ],
    joiPostSchema
});

export default router;