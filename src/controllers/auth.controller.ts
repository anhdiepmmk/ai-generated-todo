import { Request, Response, RequestHandler } from 'express';
// import logger from '~/utils/logger'; // Deprecated
import createHttpError from 'http-errors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';
import { JWT_SECRET } from '~/config/config';
import { injectable, inject } from 'tsyringe'; // Import inject
import LoggerService from '../services/logger.service'; // Import LoggerService

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: API endpoints for user authentication
 */
@injectable()
class AuthController {
  private loggerService: LoggerService;

  constructor(@inject(LoggerService) loggerService: LoggerService) {
    this.loggerService = loggerService;
  }

  /**
   * @swagger
   * /auth/register:
   *   post:
   *     summary: Register a new user
   *     tags: [Authentication]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *                 description: The email of the user
   *               password:
   *                 type: string
   *                 description: The password of the user
   *               firstName:
   *                 type: string
   *                 description: The first name of the user (optional)
   *               lastName:
   *                 type: string
   *                 description: The last name of the user (optional)
   *     responses:
   *       201:
   *         description: User created successfully
   *       400:
   *         description: Email already exists
   *       500:
   *         description: Failed to register user
   */
  register: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password, firstName, lastName } = req.body; // Added firstName, lastName
      const passwordHash = await bcrypt.hash(password, 10); // Hash the password

      const existingUser = await User.findOne({ where: { email } }); // Find by email
      if (existingUser) {
        throw createHttpError.BadRequest('Email already exists'); // Changed error message
      }

      const user = await User.create({ email, passwordHash, firstName, lastName }); // Use passwordHash and added names

      const token = jwt.sign({ id: user.id }, JWT_SECRET, {
        expiresIn: '1h',
      });

      res.status(201).json({ message: 'User created successfully', token });
    } catch (error) {
      this.loggerService.getLogger().error(error);
      throw createHttpError.InternalServerError('Failed to register user');
    }
  }

  /**
   * @swagger
   * /auth/login:
   *   post:
   *     summary: Login an existing user
   *     tags: [Authentication]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email: 
   *                 type: string
   *                 description: The email of the user
   *               password:
   *                 type: string
   *                 description: The password of the user
   *     responses:
   *       200:
   *         description: Logged in successfully
   *       400:
   *         description: Invalid credentials
   *       500:
   *         description: Failed to login
   */
  login: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body; // Changed to email

      const user = await User.findOne({ where: { email } }); // Find by email
      if (!user) {
        throw createHttpError.BadRequest('Invalid credentials');
      }

      const isPasswordValid = await bcrypt.compare(password, user.passwordHash); // Compare with passwordHash
      if (!isPasswordValid) {
        throw createHttpError.BadRequest('Invalid credentials');
      }

      const token = jwt.sign({ id: user.id }, JWT_SECRET, {
        expiresIn: '1h',
      });

      res.json({ message: 'Logged in successfully', token });
    } catch (error) {
      this.loggerService.getLogger().error(error);
      throw createHttpError.InternalServerError('Failed to login');
    }
  }

}

export default AuthController;