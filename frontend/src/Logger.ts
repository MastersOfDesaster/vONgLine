import {Logger, LoggerInstance, LoggerOptions, transports} from "winston";

export const log: LoggerInstance = new (Logger)(
    {
        level: "info",
        transports: [
            new transports.Console({
                colorize: true,
            }),
           // new (winston.transports.File)({ filename: "module.log" }),
        ],
    },
);