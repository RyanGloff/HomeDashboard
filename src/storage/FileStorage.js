import fs from 'node:fs';
import Storage from './Storage.js';
import Logger from '../Logger.js';
import Conflict409Error from "../routers/returns/Conflict409Error.js";
import NotFound404Error from "../routers/returns/NotFound404Error.js";

export default class FileStorage extends Storage {

    #fileName;

    constructor (typeName) {
        super(typeName);
        this.#fileName = `fileStorage/${typeName}.json`;
    }

    async #loadStorageFile () {
        let fileContents = {};
        if (await fs.existsSync(this.#fileName)) {
            fileContents = JSON.parse(await fs.readFileSync(this.#fileName));
        }
        return fileContents;
    }

    async #saveToStorageFile (data) {
        console.log(data);
        await fs.writeFileSync(this.#fileName, JSON.stringify(data));
    }

    async getAll () {
        return await this.#loadStorageFile();
    }

    async getById (id) {
        const all = await this.#loadStorageFile();
        if (!all.hasOwnProperty(id)) {
            throw new NotFound404Error(this.typeName, id);
        }
        return all[id];
    }

    async create (id, data) {
        const all = await this.#loadStorageFile();
        if (all.hasOwnProperty(id)) {
            throw new Conflict409Error(this.typeName, id);
        }
        data.id = id;
        all[id] = data;
        await this.#saveToStorageFile(all);
        Logger.info(`New ${this.typeName} was created with id: ${id}`);
        return data;
    }

    async update (id, data) {
        const all = await this.#loadStorageFile();
        if (!all.hasOwnProperty(id)) {
            throw new NotFound404Error(this.typeName, id);
        }
        all[id] =  data;
        await this.#saveToStorageFile(all);
        Logger.info(`Updated ${this.typeName} with id ${id}`);
        return data;
    }

    async partialUpdate (id, patch) {
        const all = await this.#loadStorageFile();
        if (!all.hasOwnProperty(id)) {
            throw new NotFound404Error(this.typeName, id);
        }
        Object.keys(patch).forEach(key => {
            // TODO: Add check to see if field is updatable
            all[id][key] = patch[key];
        });
        await this.#saveToStorageFile(all);
        Logger.info(`Updated ${this.typeName} with id ${id}`);
        return all[id];
    }

    async deleteById (id) {
        const all = await this.#loadStorageFile();
        delete all[id];
        await this.#saveToStorageFile(all);
        Logger.info(`Deleted ${this.typeName} with id ${id}`);
    }

    async deleteAll () {
        await this.#saveToStorageFile({});
        Logger.info(`Deleted all ${this.typeName}`);
    }

}