const winston = require('winston');

const index = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf((info) => {
            return `${info.timestamp} ${info.level}: ${info.message}`;
        })
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({filename: '/var/log/justStupidNodeBot.log'})
    ]
});

module.exports = index;
