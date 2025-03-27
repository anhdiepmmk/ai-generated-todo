import dotenv from 'dotenv';

dotenv.config();

export const JWT_SECRET: string = process.env.JWT_SECRET || 'your-secret-key';

export const DB_NAME: string = process.env.DB_NAME || 'database.sqlite';
export const DB_USER = process.env.DB_USER || 'root';
export const DB_PASSWORD = process.env.DB_PASSWORD || '';
export const DB_HOST = process.env.DB_HOST || 'localhost';
export const DB_PORT = process.env.DB_PORT || 3306;
export const DB_DIALECT = process.env.DB_DIALECT || 'sqlite';