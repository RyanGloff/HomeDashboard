import Joi from 'joi';

// Controllers
const controllerPostSchema = Joi.object({
    hostId: Joi.string().required(),
    name: Joi.string().required()
});

const controllerPatchSchema = Joi.object({
    name: Joi.string()
});

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
    "controller": {
        post: controllerPostSchema,
        patch: controllerPatchSchema,
        fkeys: [
            { foreignType: 'host', fkey: 'id', localKey: 'hostId' }
        ]
    },
    "host": {
        post: hostPostSchema,
        patch: hostPatchSchema
    },
    "pending-action": {
        post: pendingActionPostSchema
    }
};