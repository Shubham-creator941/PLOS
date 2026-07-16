import dotenv from 'dotenv';

dotenv.config();

const getEnvVar = (key: string, allowEmpty = false): string => {
  const value = process.env[key];
  if (value === undefined || (value === '' && !allowEmpty)) {
    throw new Error(`Startup Error: Missing required environment variable: ${key}`);
  }
  return value;
};

export interface EnvConfig {
  PORT: number;
  NODE_ENV: string;
  DB_HOST: string;
  DB_PORT: number;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_NAME: string;
  JWT_SECRET: string;
}

export const env: EnvConfig = Object.freeze({
  PORT: parseInt(getEnvVar('PORT'), 10),
  NODE_ENV: getEnvVar('NODE_ENV'),
  DB_HOST: getEnvVar('DB_HOST'),
  DB_PORT: parseInt(getEnvVar('DB_PORT'), 10),
  DB_USER: getEnvVar('DB_USER'),
  DB_PASSWORD: getEnvVar('DB_PASSWORD', true),
  DB_NAME: getEnvVar('DB_NAME'),
  JWT_SECRET: getEnvVar('JWT_SECRET'),
});
