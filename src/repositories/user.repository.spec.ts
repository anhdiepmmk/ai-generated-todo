import 'reflect-metadata';
import UserRepository from './user.repository';
import { User } from '~/models/index';
import { container } from 'tsyringe';

jest.mock('~/models/index', () => ({
  User: {
    findAll: jest.fn(),
    findByPk: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  },
}));

describe('UserRepository', () => {
  let userRepository: UserRepository;

  beforeEach(() => {
    userRepository = container.resolve(UserRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('should return all users', async () => {
      const mockUsers = [{ id: 1, email: 'test@example.com' }, { id: 2, email: 'test2@example.com' }] as any;
      (User.findAll as jest.Mock).mockResolvedValue(mockUsers);

      const users = await userRepository.getAll();

      expect(User.findAll).toHaveBeenCalledTimes(1);
      expect(users).toEqual(mockUsers);
    });
  });

  describe('getById', () => {
    it('should return a user by id if found', async () => {
      const mockUser = { id: 1, email: 'test@example.com' } as any;
      (User.findByPk as jest.Mock).mockResolvedValue(mockUser);

      const user = await userRepository.getById(1);

      expect(User.findByPk).toHaveBeenCalledTimes(1);
      expect(User.findByPk).toHaveBeenCalledWith(1);
      expect(user).toEqual(mockUser);
    });

    it('should return null if user not found', async () => {
      (User.findByPk as jest.Mock).mockResolvedValue(null);

      const user = await userRepository.getById(1);

      expect(User.findByPk).toHaveBeenCalledTimes(1);
      expect(User.findByPk).toHaveBeenCalledWith(1);
      expect(user).toBeNull();
    });
  });

  describe('getByEmail', () => {
    it('should return a user by email if found', async () => {
      const mockUser = { id: 1, email: 'test@example.com' } as any;
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);

      const user = await userRepository.getByEmail('test@example.com');

      expect(User.findOne).toHaveBeenCalledTimes(1);
      expect(User.findOne).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
      expect(user).toEqual(mockUser);
    });

    it('should return null if user not found', async () => {
      (User.findOne as jest.Mock).mockResolvedValue(null);

      const user = await userRepository.getByEmail('test@example.com');

      expect(User.findOne).toHaveBeenCalledTimes(1);
      expect(User.findOne).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
      expect(user).toBeNull();
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const mockUser = { id: 1, email: 'test@example.com' } as any;
      (User.create as jest.Mock).mockResolvedValue(mockUser);

      const user = await userRepository.create('test@example.com', 'passwordHash', 'firstName', 'lastName');

      expect(User.create).toHaveBeenCalledTimes(1);
      expect(User.create).toHaveBeenCalledWith({
        email: 'test@example.com',
        passwordHash: 'passwordHash',
        firstName: 'firstName',
        lastName: 'lastName',
      });
      expect(user).toEqual(mockUser);
    });
  });

  describe('update', () => {
    it('should update a user if found', async () => {
      const mockUser = { id: 1, email: 'test@example.com', update: jest.fn().mockResolvedValue(undefined) } as any;
      (User.findByPk as jest.Mock).mockResolvedValue(mockUser);

      const updates = { firstName: 'UpdatedFirstName' };
      const updatedUser = await userRepository.update(1, updates);

      expect(User.findByPk).toHaveBeenCalledTimes(1);
      expect(User.findByPk).toHaveBeenCalledWith(1);
      expect(mockUser.update).toHaveBeenCalledTimes(1);
      expect(mockUser.update).toHaveBeenCalledWith(updates);
      expect(updatedUser).toEqual(mockUser);
    });

    it('should return null if user not found', async () => {
      (User.findByPk as jest.Mock).mockResolvedValue(null);

      const updates = { firstName: 'UpdatedFirstName' };
      const updatedUser = await userRepository.update(1, updates);

      expect(User.findByPk).toHaveBeenCalledTimes(1);
      expect(User.findByPk).toHaveBeenCalledWith(1);
      expect(updatedUser).toBeNull();
    });
  });

  describe('delete', () => {
    it('should delete a user if found', async () => {
      const mockUser = { id: 1, email: 'test@example.com', destroy: jest.fn().mockResolvedValue(undefined) } as any;
      (User.findByPk as jest.Mock).mockResolvedValue(mockUser);

      const result = await userRepository.delete(1);

      expect(User.findByPk).toHaveBeenCalledTimes(1);
      expect(User.findByPk).toHaveBeenCalledWith(1);
      expect(mockUser.destroy).toHaveBeenCalledTimes(1);
      expect(result).toBe(true);
    });

    it('should return false if user not found', async () => {
      (User.findByPk as jest.Mock).mockResolvedValue(null);

      const result = await userRepository.delete(1);

      expect(User.findByPk).toHaveBeenCalledTimes(1);
      expect(User.findByPk).toHaveBeenCalledWith(1);
      expect(result).toBe(false);
    });
  });
});