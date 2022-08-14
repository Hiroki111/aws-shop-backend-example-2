import winston from "winston";
import { Format } from "logform";

interface LoggerInterface {
  LOG: (message: string) => void;
  ERROR: (message: string) => void;
  WARN: (message: string) => void;
}

class WinstonLogger implements LoggerInterface {
  private readonly logger: winston.Logger;
  private readonly format: Format;

  constructor() {
    this.format = winston.format.combine(
      winston.format.colorize(),
      winston.format.timestamp(),
      winston.format.align(),
      winston.format.printf(
        (info) => `${info.timestamp} ${info.level}: ${info.message}`
      )
    );

    this.logger = winston.createLogger({
      level: process.env.ENV_STAGE === "prod" ? "error" : "info",
      transports: [
        new winston.transports.Console({
          format: this.format,
        }),
      ],
    });
  }
  LOG(message: string) {
    this.logger.info(message);
  }

  ERROR(message: string) {
    this.logger.error(message);
  }

  WARN(message: string) {
    this.logger.warn(message);
  }
}

const winstonLogger = new WinstonLogger();

export { winstonLogger };
