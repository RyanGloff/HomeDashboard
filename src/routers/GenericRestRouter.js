import { Router } from 'express';
import { v4 } from 'uuid';
import InMemoryStorage from '../storage/InMemoryStoarge.js';
import FileStorage from '../storage/FileStorage.js';
import BadRequest400Error from './returns/BadRequest400Error.js';
import errorHandler from './middleware/ErrorHandler.js';

const SupportedMethods = {
    GET_BY_ID: 1,
    GET_ALL: 2,
    POST: 3,
    PATCH: 4,
    DELETE_BY_ID: 5,
    DELETE_ALL: 6
};

/**
 * Creates a generic Rest router
 * @param {typeName, removedMethods, uniqueFields, joiPostSchema, joiPatchSchema} options 
 * @returns Express Router with the described methods and validations
 */
function createGenericRestRouter(options) {
    if (options === undefined
        || !options.hasOwnProperty('typeName')) {
            throw new Error('createGenericRestRouter options requires typeName and allowedMethods');
    }

    
    function ifMethodAllowed(method, createEndpointFn) {
        if (!options.hasOwnProperty('removedMethods') || options.removedMethods.indexOf(method) < 0) {
            createEndpointFn();
        }
    }

    const router = Router();
    const storage = new FileStorage({ typeName: options.typeName });

    ifMethodAllowed(SupportedMethods.GET_ALL, () => router.get('/', (req, res) => {
        storage.getAll()
            .then(v => res.json(v))
            .catch(err => errorHandler(err, req, res));
    }));
    
    ifMethodAllowed(SupportedMethods.GET_BY_ID, () => router.get('/:id', (req, res) => {
        storage.getById(req.params.id)
            .then(v => res.json(v))
            .catch(err => errorHandler(err, req, res));
    }));

    ifMethodAllowed(SupportedMethods.POST, () => router.post('/', (req, res) => {
        if (options.hasOwnProperty('joiPostSchema')) {
            const validation = options.joiPostSchema.validate(req.body);
            if (validation.hasOwnProperty('error')) throw new BadRequest400Error(validation.error);
        }
        
        const newId = v4();
        storage.create(newId, req.body)
            .then(v => res.json(v))
            // .catch(err => errorHandler(err, req, res));
    }));

    ifMethodAllowed(SupportedMethods.PATCH, () => router.patch('/:id', (req, res) => {
        if (options.hasOwnProperty('joiPatchSchema')) {
            const validation = options.joiPatchSchema.validate(req.body);
            if (validation.hasOwnProperty('error')) throw new BadRequest400Error(validation.error);
        }

        storage.partialUpdate(req.params.id, req.body)
            .then(v => res.json(v))
            .catch(err => errorHandler(err, req, res));
    }));

    ifMethodAllowed(SupportedMethods.DELETE_BY_ID, () => router.delete('/:id', (req, res) => {
        storage.deleteById(req.params.id)
            .then(() => res.sendStatus(204))
            .catch(err => errorHandler(err, req, res));
    }));

    ifMethodAllowed(SupportedMethods.DELETE_ALL, () => router.delete('/', (req, res) => {
        storage.deleteAll()
            .then(() => res.sendStatus(204))
            .catch(err => errorHandler(err, req, res));
    }));

    return router;
}

export default { createGenericRestRouter, SupportedMethods };