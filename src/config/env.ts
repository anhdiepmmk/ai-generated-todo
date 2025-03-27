import dotenv from 'dotenv';

dotenv.config();

export const JWT_SECRET: string = process.env.JWT_SECRET || 'your-secret-key';

export const DB_NAME: string = process.env.DB_NAME || 'database.sqlite';
export const DB_USER: string = process.env.DB_USER || 'root';
export const DB_PASSWORD: string = process.env.DB_PASSWORD || '';
export const DB_HOST: string = process.env.DB_HOST || 'localhost';
export const DB_PORT: number = Number(process.env.DB_PORT) || 3306;
export const DB_DIALECT: string = process.env.DB_DIALECT || 'sqlite';