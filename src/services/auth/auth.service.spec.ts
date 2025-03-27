import 'reflect-metadata';
import { createMock } from '@golevelup/ts-jest';
import AuthService from '~/services/auth/auth.service';
import UserRepository from '~/repositories/user.repository';
import LoggerService from '~/services/logger.service';
import bcrypt from 'bcryptjs';
import createHttpError from 'http-errors';
import { container, DependencyContainer } from 'tsyringe';

describe('AuthService', () => {
  let authService: AuthService;
  let childContainer: DependencyContainer;
  let userRepositoryMock: UserRepository;
  let loggerServiceMock: LoggerService;

  beforeEach(() => {
    childContainer = container.createChildContainer();
    childContainer.register(UserRepository, { useValue: createMock<UserRepository>() });
    childContainer.register(LoggerService, { useValue: createMock<LoggerService>() });
    childContainer.register(AuthService, { useClass: AuthService });

    authService = childContainer.resolve(AuthService);
    userRepositoryMock = childContainer.resolve(UserRepository);
    loggerServiceMock = childContainer.resolve(LoggerService);
  });
  
  describe('register', () => {
    it('should register a new user successfully', async () => {
      const email: string = 'test@example.com';
      const password: string = 'password123';
      const firstName: string = 'Test';
      const lastName: string = 'User';

      jest.spyOn(userRepositoryMock, 'getByEmail').mockResolvedValue(null);
      jest.spyOn(userRepositoryMock, 'create').mockResolvedValue({ id: 1, email, firstName, lastName, passwordHash: 'hashedPassword' } as any); // Mock user creation

      const result: any = await authService.register(email, password, firstName, lastName);

      expect(userRepositoryMock.getByEmail).toHaveBeenCalledWith(email);
      expect(userRepositoryMock.create).toHaveBeenCalledWith(email, expect.any(String), firstName, lastName); // Password hash is generated
      expect(result.message).toBe('User created successfully');
      expect(result.token).toBeDefined();
    });

    it('should throw BadRequest error if email already exists', async () => {
      const email: string = 'test@example.com';
      const password: string = 'password123';

      jest.spyOn(userRepositoryMock, 'getByEmail').mockResolvedValue({ id: 1, email: 'test@example.com', passwordHash: 'hashedPassword' } as any); // Existing user

      await expect(authService.register(email, password)).rejects.toThrowError(createHttpError.BadRequest);
      expect(userRepositoryMock.getByEmail).toHaveBeenCalledWith(email);
      expect(userRepositoryMock.create).not.toHaveBeenCalled();
    });

    it('should handle errors and throw InternalServerError', async () => {
      const email: string = 'test@example.com';
      const password: string = 'password123';

      jest.spyOn(userRepositoryMock, 'getByEmail').mockRejectedValue(new Error('Database error')); // Simulate database error

      await expect(authService.register(email, password)).rejects.toThrowError(createHttpError.InternalServerError);
      expect(loggerServiceMock.error).toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('should login an existing user successfully', async () => {
      const email: string = 'test@example.com';
      const password: string = 'password123';
      const passwordHash: string = await bcrypt.hash(password, 10);

      jest.spyOn(userRepositoryMock, 'getByEmail').mockResolvedValue({ id: 1, email, passwordHash } as any); // Existing user with hashed password

      const result: any = await authService.login(email, password);

      expect(userRepositoryMock.getByEmail).toHaveBeenCalledWith(email);
      expect(result.message).toBe('Logged in successfully');
      expect(result.token).toBeDefined();
    });

    it('should throw BadRequest error for invalid credentials (user not found)', async () => {
      const email: string = 'test@example.com';
      const password: string = 'password123';

      jest.spyOn(userRepositoryMock, 'getByEmail').mockResolvedValue(null); // User not found

      await expect(authService.login(email, password)).rejects.toThrowError(createHttpError.BadRequest);
      expect(userRepositoryMock.getByEmail).toHaveBeenCalledWith(email);
    });

    it('should throw BadRequest error for invalid credentials (invalid password)', async () => {
      const email: string = 'test@example.com';
      const password: string = 'wrongpassword';
      const passwordHash: string = await bcrypt.hash('password123', 10); // Correct password hash

      jest.spyOn(userRepositoryMock, 'getByEmail').mockResolvedValue({ id: 1, email, passwordHash } as any); // Existing user with correct hashed password

      await expect(authService.login(email, password)).rejects.toThrowError(createHttpError.BadRequest);
      expect(userRepositoryMock.getByEmail).toHaveBeenCalledWith(email);
    });

    it('should handle errors and throw InternalServerError during login', async () => {
      const email: string = 'test@example.com';
      const password: string = 'password123';

      jest.spyOn(userRepositoryMock, 'getByEmail').mockRejectedValue(new Error('Database error')); // Simulate database error

      await expect(authService.login(email, password)).rejects.toThrowError(createHttpError.InternalServerError);
      expect(loggerServiceMock.error).toHaveBeenCalled();
    });
  });
});