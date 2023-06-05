export default class Storage {
    typeName;

    constructor(typeName) {
        this.typeName = typeName;
    }

    async getAll() {
        return [];
    }
    async getById(id) {
        return undefined;
    }
    async create(id, data) {
        return {};
    }
    async update(id, data) {
        return {};
    }
    async partialUpdate(id, patch) {
        return {};
    }
    async deleteById(id) {}
    async deleteAll() {}
};