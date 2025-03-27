import { injectable, inject } from 'tsyringe';
import { User } from '~/models';
import LoggerService from '../logger.service';
import UserRepository from '../../repositories/user.repository'; // Import UserRepository
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import { JWT_SECRET } from '~/config/config';

@injectable()
export default class AuthService {
  private loggerService: LoggerService;
  private userRepository: UserRepository; // Inject UserRepository

  constructor(
    @inject(LoggerService) loggerService: LoggerService,
    @inject(UserRepository) userRepository: UserRepository // Inject UserRepository
  ) {
    this.loggerService = loggerService;
    this.userRepository = userRepository; // Initialize UserRepository
  }

  async register(email: string, password: string, firstName?: string, lastName?: string): Promise<{ message: string; token: string }> {
    try {
      const passwordHash: string = await bcrypt.hash(password, 10);
      const existingUser: User | null = await this.userRepository.getByEmail(email); // Use UserRepository

      if (existingUser) {
        throw createHttpError.BadRequest('Email already exists');
      }

        const user: User = await this.userRepository.create(
          email,
          passwordHash,
          firstName,
          lastName
        ); // Use UserRepository

        const token: string = jwt.sign({ id: user.id }, JWT_SECRET, {
          // Assign to the outer token variable
          expiresIn: "1h",
        });
      return { message: 'User created successfully', token };
    } catch (error) {
      this.loggerService.error(error);
      if (createHttpError.isHttpError(error)) { // Check if it's an HttpError
        throw error; // Re-throw HttpErrors (like BadRequest)
      }
      throw createHttpError.InternalServerError('Failed to register user'); // Throw InternalServerError for other errors
    }
  }

  async login(email: string, password: string): Promise<{ message: string; token: string }> {
    try {
      const user: User | null = await this.userRepository.getByEmail(email); // Use UserRepository
      if (!user) {
        throw createHttpError.BadRequest('Invalid credentials');
      }
      const isPasswordValid: boolean = await bcrypt.compare(password, user!.passwordHash);
      if (!isPasswordValid) {
        throw createHttpError.BadRequest('Invalid credentials');
      }
      const token: string = jwt.sign({ id: user!.id }, JWT_SECRET, {
        expiresIn: '1h',
      });
      return { message: 'Logged in successfully', token };
    } catch (error) {
      this.loggerService.error(error);
      if (createHttpError.isHttpError(error)) { // Check if it's an HttpError
        throw error; // Re-throw HttpErrors (like BadRequest)
      }
      throw createHttpError.InternalServerError('Failed to login'); // Throw InternalServerError for other errors
    }
  }
}