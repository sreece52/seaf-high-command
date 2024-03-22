const winston = require('winston');

module.exports = {
    configureLogger: () => {
        winston.configure({
            transports: [
                new winston.transports.File({ filename: 'error.log', level: 'error' }),
                new winston.transports.File({ filename: 'combined.log' }),
            ]
        });
    }
}

