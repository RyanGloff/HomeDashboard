import Winston from 'winston';

export default (Winston.createLogger({
    transports: [
        new Winston.transports.Console({
            json: false,
            timestamp: true,
            depth:true,
            colorize:true
        })
    ]
}));