import { config } from "../../utils/v1/config";
import { createLogger, format, transports } from "winston";
import path from "path";
import "winston-daily-rotate-file";
import fs from "fs";

const {
  combine,
  timestamp,
  printf,
  // json
} = format;
const myFormat = printf(
  ({
    level,
    message,
    timestamp,
    // txId,path
  }) => {
    return `[${level}] ${timestamp} ${message}`;
  },
);

export function developmentLogger(isRotate: boolean) {
  const logFolder = path.join(
    __dirname,
    "..",
    "..",
    "..",
    config.LOG_ROTATE_FOLDER_NAME,
    "v1/Development_logs",
  );
  const logFilePath = isRotate
    ? path.join(logFolder, `${new Date().toISOString().split("T")[0]}.log`)
    : path.join(__dirname, "../../Errors/v1/development_logs/development.log");

  const logger = createLogger({
    level: "info",
    format: combine(timestamp({ format: "HH:mm:ss" }), myFormat),
    transports: [new transports.Console()],
  });

  // Conditionally add the DailyRotateFile transport if isRotate is true
  if (isRotate) {
    logger.add(
      new transports.DailyRotateFile({
        filename: `${logFolder}/%DATE%.log`,
        level: "info",
        datePattern: "DD-MM-YYYY", // Daily rotation
        maxFiles: config.LOG_ROTATE_EXPIRY, // Keep logs for 30 days (one month)
        format: combine(timestamp({ format: "HH:mm:ss" })),
      }),
    );

    // Cleanup old log files exceeding maxFiles
    const cleanupOldLogFiles = () => {
      const logFiles = fs.readdirSync(logFolder);
      if (logFiles.length > config.LOG_ROTATE_EXPIRY) {
        const filesToDelete = logFiles.slice(0, logFiles.length - config.LOG_ROTATE_EXPIRY);
        for (const file of filesToDelete) {
          const filePath = path.join(logFolder, file);
          fs.unlinkSync(filePath);
        }
      }
    };
    // Schedule log files cleanup at regular intervals (e.g., once a day)
    setInterval(cleanupOldLogFiles, 24 * 60 * 60 * 1000); // 24 hours
  } else {
    // If rotation is not enabled, add a simple file transport
    logger.add(
      new transports.File({
        filename: logFilePath,
        level: "info",
        format: combine(timestamp({ format: "HH:mm:ss" })),
      }),
    );
  }

  return logger;
}
