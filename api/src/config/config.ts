export const ENVIRONMENT = process.env.NODE_ENV || "development";
export const ENVIRONMENT_IS_PRODUCTION = ENVIRONMENT === "production";
export const ENVIRONMENT_IS_TEST = ENVIRONMENT === "test";
export const API_PUBLISH_HOST = process.env.API_PUBLISH_HOST;
export const API_PUBLISH_PROTOCOL = process.env.API_PUBLISH_PROTOCOL || "http";
export const API_PUBLISH_PORT = Number(process.env.API_PUBLISH_PORT);
export const API_PORT = Number(process.env.API_PORT) || 8080;
export const API_PREFIX_PATH = process.env.API_PREFIX_PATH || "/";
export const API_MYSQL = {
  USER: process.env.API_MYSQL_USER,
  PASSWORD: process.env.API_MYSQL_PASSWORD,
  HOST: process.env.API_MYSQL_HOST,
  NAME: process.env.API_MYSQL_DATABASE,
  PUBLISHPORT: process.env.API_MYSQL_PUBLISH_PORT,
  PORT: Number(process.env.API_MYSQL_PORT) || 3306,
};
export const TRANSBANK = {
  RESPONSE_URL: process.env.API_RESPONSE_URL , 
};
