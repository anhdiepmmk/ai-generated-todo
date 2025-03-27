import pino, { Logger } from 'pino';
import { injectable } from 'tsyringe';

@injectable()
class LoggerService {
  private logger: Logger;

  constructor() {
    this.logger = pino({
      level: process.env.LOG_LEVEL || 'info',
      transport: process.env.NODE_ENV === 'local' ? {
        target: 'pino-pretty',
        options: {
          translateTime: 'yyyy-mm-dd HH:MM:ss.l',
          ignore: 'pid,hostname',
        },
      } : undefined,
    });
  }

  log(msg: string, ...args: any[]) {
    this.logger.info(msg, ...args);
  }

  error(obj: any, msg?: string, ...args: any[]) {
    this.logger.error(obj, msg, ...args);
  }

  warn(msg: string, ...args: any[]) {
    this.logger.warn(msg, ...args);
  }

  debug(msg: string, ...args: any[]) {
    this.logger.debug(msg, ...args);
  }

  info(msg: string, ...args: any[]) {
    this.logger.info(msg, ...args);
  }
}

export default LoggerService;