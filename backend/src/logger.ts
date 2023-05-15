import { time } from 'console';
import {createLogger, transports, format } from 'winston';
import { logConfig } from './configs/log.config';

const logger = createLogger({
    level: "info",
    format: format.combine(
        format.timestamp({format: () => {
            return new Date().toLocaleString('en-US', {
                timeZone: 'Moscow'
            });
        }}),
        format.colorize(),
        format.printf(({timestamp, level, message}) => {
            return `[${timestamp}] ${level}: ${message}`
        })
    ),
    transports: [
        new transports.File({filename: logConfig.errorPath, level: "warn"}),
        new transports.File({filename: logConfig.infoPath}),
    ],
});

export default logger;