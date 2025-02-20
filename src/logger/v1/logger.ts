import { developmentLogger } from "./developmentLogger";
import { productionLogger } from "./productionLogger";
import { Logger as WinstonLogger } from "winston";
import { config } from "../../utils/v1/config";
interface Logger extends WinstonLogger {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [x: string]: any;
  // You can add your custom methods here if needed
}

let logger: Logger | null = null;

if (process.env.NODE_ENV !== "production") {
  logger = developmentLogger(config.IS_ROTATE);
}

if (process.env.NODE_ENV === "production") {
  logger = productionLogger(config.IS_ROTATE);
}
export default logger;
