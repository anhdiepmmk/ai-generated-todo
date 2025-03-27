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

  getLogger(): Logger {
    return this.logger;
  }
}

export default LoggerService;