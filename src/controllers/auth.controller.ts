import { Request, Response, RequestHandler } from 'express';
// import logger from '~/utils/logger'; // Deprecated
import createHttpError from 'http-errors';
import { injectable, inject } from 'tsyringe'; // Import inject
import LoggerService from '../services/logger.service'; // Import LoggerService
import AuthService from '../services/auth/auth.service';
import { registerSchema, loginSchema } from './auth.dto'; // Import DTO schemas

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: API endpoints for user authentication
 */
@injectable()
class AuthController {
  private loggerService: LoggerService;
  private authService: AuthService; // Inject AuthService

  constructor(
    @inject(LoggerService) loggerService: LoggerService,
    @inject(AuthService) authService: AuthService // Inject AuthService
  ) {
    this.loggerService = loggerService;
    this.authService = authService; // Initialize AuthService
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
    const dto = registerSchema.parse(req.body); // Parse request body with DTO
    const result = await this.authService.register(
      dto.email,
      dto.password,
      dto.firstName,
      dto.lastName
    ); // Call AuthService with DTO
    res.status(201).json(result); // Send service result to response
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
    const dto = loginSchema.parse(req.body); // Parse request body with DTO
    const result = await this.authService.login(dto.email, dto.password); // Call AuthService with DTO
    res.json(result); // Send service result to response
  }

}

export default AuthController;