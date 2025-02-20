import * as dotenv from "dotenv";
import { existsSync } from "fs";
import { resolve } from "path";
// import configJSON from "../../../config.json";

dotenv.config({ path: resolve(process.cwd(), ".env") });
const envFile = `.env.${process.env.NODE_ENV ? process.env.NODE_ENV : "development"}`;
const envFilePath = resolve(process.cwd(), envFile);
const finalEnvFile = existsSync(envFilePath) ? envFilePath : resolve(process.cwd(), ".env");

dotenv.config({ path: resolve(process.cwd(), finalEnvFile) });
interface Config {
  DYNAMIC_MODELS: { [key: string]: string | object }[];
  API_KEY_SECRET:string;

  PORT: number;
  USE_DB: boolean;
  SERVICE_NAME: string;
  NODE_ENV: string;
  LOG_ROTATE_FOLDER_NAME: string;
  LOG_ROTATE_EXPIRY: number;
  LOG_LEVEL: string;
  LOG_DIR: string;
  GOOGLE_SHEETS:string;
  ACCESS_TOKEN_EXPIRY: number;
  REFRESH_TOKEN_EXPIRY: number;
  OTP_EXPIRY: string;
  JWT_SECRET_KEY: string;
  MONGODB_URI: string;
  IS_ROTATE: boolean;
  ADMIN_NAME: string;
  ADMIN_EMAIL: string;
  ADMIN_PHONE_NUMBER: string;
  ADMIN_COUNTRY_CODE: string;
  SWAGGER_URLS: string;
  AWS_ACCESS_KEY_ID: string;
  AWS_SECRET_ACCESS_KEY: string;
  GOOGLE_SERVICE_JSON: string;
  ENVIRONMENT: string;

  
}

// Helper function to load environment variables with error handling
function getEnvVariable(key: string, mandatory = true): string {
  const value = process.env[key];

  if (!value && mandatory) {
    throw new Error(`Environment variable ${key} is missing.`);
  }
  return value as string;
}

// Load environment variables and map them to the Config interface
export const config: Config = {
  
  PORT: Number(getEnvVariable("PORT", true)),
  ENVIRONMENT:String(getEnvVariable("ENVIRONMENT",true)),
  SERVICE_NAME: getEnvVariable("SERVICE_NAME", false) || "Backend Service",
  NODE_ENV: getEnvVariable("NODE_ENV", true),
  GOOGLE_SHEETS: getEnvVariable("GOOGLE_SHEETS", true),
  MONGODB_URI: getEnvVariable("MONGODB_URI", true),
  USE_DB: Boolean(process.env.USE_DB) || true,
  LOG_ROTATE_FOLDER_NAME: "log_Rotate",
  API_KEY_SECRET:String(getEnvVariable("API_KEY_SECRET", true)),

  LOG_ROTATE_EXPIRY: 30,
  LOG_LEVEL: "info",
  LOG_DIR: "../logger",
  GOOGLE_SERVICE_JSON: getEnvVariable("GOOGLE_SERVICE_JSON", true),
  DYNAMIC_MODELS: [],
  ACCESS_TOKEN_EXPIRY: parseInt(getEnvVariable("ACCESS_TOKEN_EXPIRY", false)) || 1, // Parse to int
  REFRESH_TOKEN_EXPIRY: parseInt(getEnvVariable("REFRESH_TOKEN_EXPIRY", false)) || 5256000, // Parse to int
  OTP_EXPIRY: getEnvVariable("OTP_EXPIRY", true),
  JWT_SECRET_KEY: getEnvVariable("JWT_SECRET_KEY", true),
  IS_ROTATE: Boolean(getEnvVariable("IS_ROTATE", false)) || true,
  ADMIN_NAME: getEnvVariable("ADMIN_NAME", true),
  ADMIN_EMAIL: getEnvVariable("ADMIN_EMAIL", true),
  ADMIN_PHONE_NUMBER: getEnvVariable("ADMIN_PHONE_NUMBER", true),
  ADMIN_COUNTRY_CODE: getEnvVariable("ADMIN_COUNTRY_CODE", true),
  SWAGGER_URLS: getEnvVariable("SWAGGER_URLS", true),
  AWS_ACCESS_KEY_ID:getEnvVariable("S3_AWS_ACCESS_KEY_ID", true),
  AWS_SECRET_ACCESS_KEY:getEnvVariable("S3_AWS_SECRET_ACCESS_KEY", true),

  
};
