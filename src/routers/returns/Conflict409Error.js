export default class Error409 extends Error {

    constructor(typeName, id) {
        super(`${typeName} with id ${id} already exists`);
    }
    
}