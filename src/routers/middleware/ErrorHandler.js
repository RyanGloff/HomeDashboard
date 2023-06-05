import BadRequest400Error from '../returns/BadRequest400Error.js';
import NotFound404Error from '../returns/NotFound404Error.js';
import Conflict409Error from '../returns/Conflict409Error.js';
import Logger from '../../Logger.js';

const errorHandler = (err, req, res) => {
    Logger.error(`Error handler reached: ${err}`);
    if (err instanceof BadRequest400Error) {
        res.status(400).json({ error: err.message });
    } else if (err instanceof NotFound404Error) {
        res.status(404).json({ error: err.message });
    } else if (err instanceof Conflict409Error) {
        res.status(409).json({ error: err.message });
    } else if (err instanceof Error) {
        res.status(500).json({ error: err.message });
    }
};

export default errorHandler;