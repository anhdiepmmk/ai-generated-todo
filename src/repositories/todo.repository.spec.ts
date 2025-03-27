import 'reflect-metadata';
import TodoRepository from './todo.repository';
import { Todo } from '../models';
import { Sequelize } from 'sequelize';

// Mock the Todo model and Sequelize for testing
jest.mock('../models', () => {
  const mockTodo = {
    findAndCountAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    destroy: jest.fn(),
  };
  return {
    Todo: mockTodo,
    sequelize: {
      transaction: jest.fn(async (callback) => {
        await callback();
      }),
    },
  };
});

describe('TodoRepository', () => {
  let todoRepository: TodoRepository;
  const mockedTodo = Todo as jest.Mocked<typeof Todo>;

  beforeEach(() => {
    todoRepository = new TodoRepository();
    jest.clearAllMocks();
  });

  describe('search', () => {
    it('should call Todo.findAndCountAll with correct parameters', async () => {
      const userId = 1;
      const limit = 10;
      const offset = 0;

      await todoRepository.search(userId, limit, offset);

      expect(mockedTodo.findAndCountAll).toHaveBeenCalledWith({
        where: { userId },
        limit,
        offset,
      });
    });
  });

  describe('getByUserIdAndId', () => {
    it('should call Todo.findOne with correct parameters', async () => {
      const id = 1;
      const userId = 1;

      await todoRepository.getByUserIdAndId(id, userId);

      expect(mockedTodo.findOne).toHaveBeenCalledWith({
        where: { id, userId },
      });
    });
  });

  describe('create', () => {
    it('should call Todo.create with correct parameters', async () => {
      const title = 'Test Todo';
      const userId = 1;

      await todoRepository.create(title, userId);

      expect(mockedTodo.create).toHaveBeenCalledWith({
        title,
        completed: false,
        userId,
      });
    });
  });

  describe('update', () => {
    it('should update and save todo if todo exists', async () => {
      const id = 1;
      const completed = true;
      const userId = 1;
      const mockTodoInstance = {
        id: 1,
        completed: false,
        save: jest.fn(),
        _attributes: {},
        dataValues: {},
        _creationAttributes: {},
        isNewRecord: false,
      };
      mockedTodo.findOne.mockResolvedValue(mockTodoInstance as any);

      await todoRepository.update(id, completed, userId);

      expect(mockedTodo.findOne).toHaveBeenCalledWith({
        where: { id, userId },
      });
      expect(mockTodoInstance.completed).toBe(completed);
      expect(mockTodoInstance.save).toHaveBeenCalled();
    });

    it('should return null if todo does not exist', async () => {
      const id = 1;
      const completed = true;
      const userId = 1;
      mockedTodo.findOne.mockResolvedValue(null);

      const result = await todoRepository.update(id, completed, userId);

      expect(result).toBeNull();
    });
  });

  describe('delete', () => {
    it('should delete todo if todo exists', async () => {
      const id = 1;
      const userId = 1;
      const mockTodoInstance = {
        destroy: jest.fn().mockResolvedValue(true),
        _attributes: {},
        dataValues: {},
        _creationAttributes: {},
        isNewRecord: false,
      };
      mockedTodo.findOne.mockResolvedValue(mockTodoInstance as any);

      const result = await todoRepository.delete(id, userId);

      expect(mockedTodo.findOne).toHaveBeenCalledWith({
        where: { id, userId },
      });
      expect(mockTodoInstance.destroy).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should return false if todo does not exist', async () => {
      const id = 1;
      const userId = 1;
      mockedTodo.findOne.mockResolvedValue(null);

      const result = await todoRepository.delete(id, userId);

      expect(result).toBe(false);
    });
  });
});