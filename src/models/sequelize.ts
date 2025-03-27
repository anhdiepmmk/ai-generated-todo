import { Sequelize, Dialect } from 'sequelize';
import { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_DIALECT } from '../config/env';

const nodeEnv: string = process.env.NODE_ENV || 'development';

let sequelize: Sequelize;

if (nodeEnv === 'local') {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'database.sqlite',
    logging: nodeEnv === 'local' ? (msg) => require('../utils/logger').logger.debug(msg) : false,
  });
} else {
  sequelize = new Sequelize({
    database: DB_NAME,
    username: DB_USER,
    password: DB_PASSWORD,
    host: DB_HOST,
    port: Number(DB_PORT),
    dialect: DB_DIALECT as Dialect,
    logging: false,
  });
}

export default sequelize;