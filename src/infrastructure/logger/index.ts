import { transports, format, createLogger, Logger } from 'winston';


export const logger: Logger = createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  transports: [
    new transports.Console({
      format: format.simple(),
    }),
  ],
  exitOnError: true,
});
