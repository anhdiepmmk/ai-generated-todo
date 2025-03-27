import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import { JWT_SECRET } from '~/config/config';

interface UserPayload {
  id: number;
}

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, JWT_SECRET, (err, payload) => {
      if (err) {
        return next(createHttpError.Forbidden('Invalid token'));
      }

      req.user = payload as UserPayload;
      next();
    });
  } else {
    next(createHttpError.Unauthorized('Token not provided'));
  }
};