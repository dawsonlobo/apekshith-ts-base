import { createLogger, format, transports } from "winston";
import { config } from "../../utils/v1/config";
import path from "path";
import "winston-daily-rotate-file";
const {
  combine,
  timestamp,
  printf,
  // json
} = format;
import fs from "fs";

const myFormat = printf(({ level, message, timestamp, path }) => {
  return `[${level}] ${timestamp} ${message} ${path}`;
});

export function productionLogger(isRotate: boolean) {
  const logFolder = path.join(
    __dirname,
    "..",
    "..",
    "..",
    config.LOG_ROTATE_FOLDER_NAME,
    "v1/Production_logs",
  );
  const logFilePath = isRotate
    ? path.join(logFolder, `${new Date().toISOString().split("T")[0]}.log`)
    : path.join(__dirname, "../../Errors/v1/Production_logs/production.log");

  const logger = createLogger({
    level: "info",
    format: combine(timestamp(), myFormat),
    transports: [new transports.Console()],
  });

  // Add a custom filter to log messages containing "path:" to the file
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
