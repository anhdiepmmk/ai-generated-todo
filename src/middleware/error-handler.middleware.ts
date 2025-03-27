import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import logger from '~/utils/logger';
import { HttpError } from 'http-errors';
import { ZodError } from 'zod';
import { ValidationError as SequelizeError } from 'sequelize';

export const errorHandler: ErrorRequestHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(err.stack);

  if (err instanceof HttpError) {
    res.status(err.statusCode).json({ message: err.message });
    return next(err);
  }

  if (err instanceof ZodError) {
    res.status(400).json({ message: 'Validation error', errors: err.errors });
    return next(err);
  }

  if (err instanceof SequelizeError) {
    res.status(500).json({ message: 'Database error' });
    return next(err);
  }

  res.status(500).json({ message: 'Something went wrong' });
  return next(err);
};