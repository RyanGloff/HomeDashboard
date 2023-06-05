import GenericRestRouter from '../GenericRestRouter.js'
import Joi from 'joi';

const SUPPORTED_HANDLERS = [
    'kasa-power-strip',
    'kasa-power-strip-with-montioring',
    'kasa-light'
];

const joiPostSchema = Joi.object({
    name: Joi.string()
            .alphanum()
            .required(),
    handler: Joi.valid(... SUPPORTED_HANDLERS),
    connectionString: Joi.string().required()
});

const joiPatchSchema = Joi.object({
    name: Joi.string()
            .alphanum(),
    connectionString: Joi.string()
});

const router = GenericRestRouter.createGenericRestRouter({
    typeName: 'devices',
    joiPostSchema,
    joiPatchSchema
});

export default router;