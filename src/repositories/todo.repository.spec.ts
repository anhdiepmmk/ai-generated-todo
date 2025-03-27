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
  });

  describe('search', () => {
    it('should call Todo.findAndCountAll with correct parameters', async () => {
      const userId: number = 1;
      const limit: number = 10;
      const offset: number = 0;
      const findAndCountAllMock = jest.spyOn(mockedTodo, 'findAndCountAll');

      await todoRepository.search(userId, limit, offset);

      expect(findAndCountAllMock).toHaveBeenCalledWith({
        where: { userId },
        limit,
        offset,
      });
    });
  });

  describe('getByUserIdAndId', () => {
    it('should call Todo.findOne with correct parameters', async () => {
      const id: number = 1;
      const userId = 1;
      const findOneMock = jest.spyOn(mockedTodo, 'findOne');

      await todoRepository.getByUserIdAndId(id, userId);

      expect(findOneMock).toHaveBeenCalledWith({
        where: { id, userId },
      });
    });
  });

  describe('create', () => {
    it('should call Todo.create with correct parameters', async () => {
      const title: string = 'Test Todo';
      const userId = 1;
      const createMock = jest.spyOn(mockedTodo, 'create');

      await todoRepository.create(title, userId);

      expect(createMock).toHaveBeenCalledWith({
        title,
        completed: false,
        userId,
      });
    });
  });

  describe('update', () => {
    it('should update and save todo if todo exists', async () => {
      const id = 1;
      const completed: boolean = true;
      const userId = 1;
      const mockTodoInstance: any = {
        id: 1,
        completed: false,
        save: jest.fn(),
      };
      const findOneMock = jest.spyOn(mockedTodo, 'findOne').mockResolvedValue(mockTodoInstance as any);
      const saveMock = jest.spyOn(mockTodoInstance, 'save');

      await todoRepository.update(id, completed, userId);

      expect(findOneMock).toHaveBeenCalledWith({
        where: { id, userId },
      });
      expect(mockTodoInstance.completed).toBe(completed);
      expect(saveMock).toHaveBeenCalled();
    });

    it('should return null if todo does not exist', async () => {
      const id = 1;
      const completed = true;
      const userId = 1;
      const findOneMock = jest.spyOn(mockedTodo, 'findOne').mockResolvedValue(null);

      const result: Todo | null = await todoRepository.update(id, completed, userId);

      expect(result).toBeNull();
    });
  });

  describe('delete', () => {
    it('should delete todo if todo exists', async () => {
      const id = 1;
      const userId = 1;
      const mockTodoInstance: any = {
        destroy: jest.fn().mockResolvedValue(true),
      };
      const findOneMock = jest.spyOn(mockedTodo, 'findOne').mockResolvedValue(mockTodoInstance as any);
      const destroyMock = jest.spyOn(mockTodoInstance, 'destroy');

      const result = await todoRepository.delete(id, userId);

      expect(findOneMock).toHaveBeenCalledWith({
        where: { id, userId },
      });
      expect(destroyMock).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should return false if todo does not exist', async () => {
      const id = 1;
      const userId = 1;
      const findOneMock = jest.spyOn(mockedTodo, 'findOne').mockResolvedValue(null);

      const result = await todoRepository.delete(id, userId);

      expect(result).toBe(false);
    });
  });
});