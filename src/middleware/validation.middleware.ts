import { Request, Response, NextFunction, RequestHandler } from 'express';
import { AnyZodObject } from 'zod';

export const validateBody = (schema: AnyZodObject): RequestHandler => async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const parsed = await schema.parseAsync(req.body);
    req.body = parsed;
    return next();
  } catch (error) {
    return next(error);
  }
};

export const validateQuery = (schema: AnyZodObject): RequestHandler => async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const parsed = await schema.parseAsync(req.query);
    req.query = parsed;
    return next();
  } catch (error) {
    return next(error);
  }
};

export const validateParams = (schema: AnyZodObject): RequestHandler => async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const parsed = await schema.parseAsync(req.params);
    req.params = parsed;
    return next();
  } catch (error) {
    return next(error);
  }
};