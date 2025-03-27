import 'reflect-metadata';
import express, { Request, Response } from 'express';
import todoRoutes from './routes/todo.routes';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import { sequelize } from '~/models/index';
// import logger from '~/utils/logger'; // Deprecated
import { errorHandler } from './middleware/error-handler.middleware';
import {  } from 'express';
import LoggerService from './services/logger.service'; // Import LoggerService
import { container } from 'tsyringe';

import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

const app = express();
const port = 3000;

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Todo API',
      version: '1.0.0',
      description: 'A simple Todo API',
    },
  },
  apis: ['./src/routes/*.ts', './src/models/*.ts', './src/controllers/*.ts'],
};

const specs = swaggerJsdoc(options);

app.use(express.json());

app.use('/todos', todoRoutes);
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use(errorHandler);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, Express!');
});

app.get('/health', (req: Request, res: Response) => {
  res.status(200).send('OK');
});

const loggerService = container.resolve(LoggerService);

sequelize.authenticate().then(() => {
  loggerService.info('Database connected'); // Use loggerService.info
  app.listen(port, () => {
    loggerService.info(`Server is running on port ${port}`); // Use loggerService.info
  });
});
