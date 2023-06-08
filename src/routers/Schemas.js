import Joi from 'joi';

// Host
const hostPostSchema = Joi.object({
    host: Joi.string().required(),
    name: Joi.string().required(),
    model: Joi.string().required()
});

const hostPatchSchema = Joi.object({
    name: Joi.string().required()
});

// PendingAction
const pendingActionPostSchema = Joi.object({
    type: Joi.valid('ChangeState').required(),
    device: Joi.string().required(),
    additionalData: Joi.string()
});

export default {
    "host": {
        post: hostPostSchema,
        patch: hostPatchSchema
    },
    "pending-action": {
        post: pendingActionPostSchema
    }
};