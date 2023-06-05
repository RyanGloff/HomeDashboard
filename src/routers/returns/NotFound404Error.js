export default class Error404 extends Error {

    constructor (typeName, id) {
        super(`Unable to find ${typeName} with id: ${id}`);
    }

}