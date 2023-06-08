export default class Error409 extends Error {

    constructor(typeName, fieldName,id) {
        super(`${typeName} with ${fieldName} ${id} already exists`);
    }
    
}