import { UserPayload } from '~/middleware/auth.middleware';

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}