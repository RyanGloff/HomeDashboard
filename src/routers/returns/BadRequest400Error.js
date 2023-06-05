export default class BadRequest400Error extends Error {

    constructor(reason) {
        super(`Bad Request: ${reason}`);
    }

}