import Storage from './Storage.js';
import Conflict409Error from "../routers/returns/Conflict409Error.js";
import NotFound404Error from "../routers/returns/NotFound404Error.js";

export default class InMemoryStorage extends Storage {
    
    #data = {};

    constructor (typeName) {
        super(typeName);
    }

    async getAll () {
        return this.#data;
    }

    async getById (id) {
        if (!this.#data.hasOwnProperty(id)) {
            throw new NotFound404Error(this.typeName, id);
        }
        return this.#data[id];
    }

    async create (id, data) {
        if (this.#data.hasOwnProperty(id)) {
            throw new Conflict409Error(this.typeName, id);
        }
        data.id = id;
        this.#data[id] = data;
        return data;
    }

    async update (id, data) {
        if (!this.#data.hasOwnProperty(id)) {
            throw new NotFound404Error(this.typeName, id);
        }
        this.#data[id] =  data;
        return data;
    }

    async partialUpdate (id, patch) {
        if (!this.#data.hasOwnProperty(id)) {
            throw new NotFound404Error(this.typeName, id);
        }
        Object.keys(patch).forEach(key => {
            // TODO: Add check to see if field is updatable
            this.#data[id][key] = patch[key];
        });
        return this.#data[id];
    }

    async deleteById (id) {
        delete this.#data[id];
    }

    async deleteAll () {
        this.#data = {};
    }

}