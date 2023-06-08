import GenericRestRouter from '../GenericRestRouter.js'
import Joi from 'joi';

const joiPostSchema = Joi.object({
    host: Joi.string().required(),
    name: Joi.string().required(),
    model: Joi.string().required()
});

const joiPatchSchema = Joi.object({
    name: Joi.string().required()
});

const router = GenericRestRouter.createGenericRestRouter({
    typeName: 'devices',
    joiPostSchema,
    joiPatchSchema
});

export default router;