import winston from "winston";
import "winston-daily-rotate-file";

// 设置日志级别
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
  verbose: 4
};

// 创建带颜色的日志格式
const colorLogFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.printf((info) => {
    let colorPrefix = "";
    let colorSuffix = "";
    switch (info.level.toUpperCase()) {
      case "ERROR":
        colorPrefix = "\x1b[41;97m";
        colorSuffix = "\x1b[0m";
        break;
      case "WARN":
        colorPrefix = "\x1b[44;97m";
        colorSuffix = "\x1b[0m";
        break;
      case "INFO":
        colorPrefix = "";
        colorSuffix = "";
        break;
      case "DEBUG":
        colorPrefix = "\x1b[40;97m";
        colorSuffix = "\x1b[0m";
        break;
      case "VERBOSE":
        colorPrefix = "\x1b[40;97m";
        colorSuffix = "\x1b[0m";
        break;
      default:
        break;
    }
    return `[${info.timestamp}] ${colorPrefix}[${info.level.toUpperCase()}]${colorSuffix} ${info.message}`;
  })
);

// 创建不带颜色的日志格式
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.printf((info) => {
    return `[${info.timestamp}] [${info.level.toUpperCase()}] ${info.message}`;
  })
);

// 创建 rotating file transport
const dailyRotateFileTransport = new winston.transports.DailyRotateFile({
  filename: "./logs/%DATE%.log",
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "14d",
  format: logFormat,
});

// 创建 logger 实例
const winstonLogger = winston.createLogger({
  level: "verbose",
  levels: levels,
  format: colorLogFormat,
  transports: [
    new winston.transports.Console(),
    dailyRotateFileTransport
  ]
});

const logger = {
  error: winstonLogger.error.bind(winstonLogger),
  e: winstonLogger.error.bind(winstonLogger),
  warn: winstonLogger.warn.bind(winstonLogger),
  w: winstonLogger.warn.bind(winstonLogger),
  info: winstonLogger.info.bind(winstonLogger),
  i: winstonLogger.info.bind(winstonLogger),
  debug: winstonLogger.debug.bind(winstonLogger),
  d: winstonLogger.debug.bind(winstonLogger),
  verbose: winstonLogger.verbose.bind(winstonLogger),
  v: winstonLogger.verbose.bind(winstonLogger),
};

export default logger;