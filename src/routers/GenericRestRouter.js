import { Router } from 'express';
import { v4 } from 'uuid';
import FileStorage from '../storage/FileStorage.js';
import BadRequest400Error from './returns/BadRequest400Error.js';
import errorHandler from './middleware/ErrorHandler.js';
import Schemas from './Schemas.js';
import RouterConfigs from './RouterConfigs.js';

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
 * @param {typeName, removedMethods, joiPostSchema, joiPatchSchema} options 
 * @returns Express Router with the described methods and validations
 */
function createGenericRestRouter(typeName) {
    if (!typeName) {
        throw new Error('createGenericRestRouter requires typeName');
    }
    const config = RouterConfigs[typeName] || {};
    
    function ifMethodAllowed(method, createEndpointFn) {
        if (!config.hasOwnProperty('removedEndpoints') || config.removedEndpoints.indexOf(method) < 0) {
            createEndpointFn();
        }
    }

    const router = Router();
    const storage = new FileStorage({ typeName });

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

    // Collections
    ifMethodAllowed(SupportedMethods.GET_BY_ID, () => {
        if (config.hasOwnProperty('collections')) {
            Object.keys(config.collections).forEach(key => {
                const collection = config.collections[key];
                router.get(`/:id/${key}`, (req, res) => {
                    storage.getById(req.params.id)
                        .then(parent => {
                            const collectionStorage = new FileStorage({ typeName: collection.foreignType });
                            collectionStorage.getAll()
                                .then(all => {
                                    Object.keys(all).forEach(key => {
                                        const v = all[key];
                                        if (v[collection.fkey] !== parent[collection.localKey])
                                            delete all[key];
                                    });
                                    return all;
                                })
                                .then(children => res.json({ children }))
                                .catch(err => errorHandler(err, req, res));
                        })
                        .catch(err => errorHandler(err, req, res));
                });
            });
        }
    });

    ifMethodAllowed(SupportedMethods.POST, () => router.post('/', (req, res) => {
        const storeEntity = () => {
            const newId = v4();
            storage.create(newId, req.body)
                .then(v => res.json(v))
                .catch(err => errorHandler(err, req, res));
        };

        if (Schemas.hasOwnProperty(typeName)) {
            if (Schemas[typeName].hasOwnProperty('post')) {
                const validation = Schemas[typeName].post.validate(req.body);
                if (validation.hasOwnProperty('error')) throw new BadRequest400Error(validation.error);
            }
            if (Schemas[typeName].hasOwnProperty('fkeys')) {
                Schemas[typeName].fkeys.forEach(fkeyConfig => {
                    const foreignStorage = new FileStorage({ typeName: fkeyConfig.foreignType });
                    foreignStorage.getById(req.body[fkeyConfig.localKey])
                        .then(foreignEntity => storeEntity())
                        .catch(err => errorHandler(err, req, res));
                });
            } else {
                storeEntity();
            }
        }
    }));

    ifMethodAllowed(SupportedMethods.PATCH, () => router.patch('/:id', (req, res) => {
        if (Schemas.hasOwnProperty(typeName) && Schemas[typeName].hasOwnProperty('patch')) {
            const validation = Schemas[typeName].patch.validate(req.body);
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