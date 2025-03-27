import 'reflect-metadata';
import TodoService from './todo.service';
import TodoRepository from '../repositories/todo.repository';

// Mock TodoRepository
jest.mock('../repositories/todo.repository');

describe('TodoService', () => {
  let todoService: TodoService;
  const mockedTodoRepository = new TodoRepository() as jest.Mocked<TodoRepository>;

  beforeEach(() => {
    todoService = new TodoService(mockedTodoRepository);
    jest.clearAllMocks();
  });

  describe('search', () => {
    it('should call todoRepository.search with correct parameters', async () => {
      const userId = 1;
      const limit = 10;
      const offset = 0;

      await todoService.search(userId, limit, offset);

      expect(mockedTodoRepository.search).toHaveBeenCalledWith(userId, limit, offset);
    });

    it('should return the result of todoRepository.search', async () => {
      const userId = 1;
      const limit = 10;
      const offset = 0;
      const expectedResult = { rows: [], count: 0 };
      mockedTodoRepository.search.mockResolvedValue(expectedResult);

      const result = await todoService.search(userId, limit, offset);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('getById', () => {
    it('should call todoRepository.getByUserIdAndId with correct parameters', async () => {
      const id = 1;
      const userId = 1;

      await todoService.getById(id, userId);

      expect(mockedTodoRepository.getByUserIdAndId).toHaveBeenCalledWith(id, userId);
    });

    it('should return the result of todoRepository.getByUserIdAndId', async () => {
      const id = 1;
      const userId = 1;
      const expectedResult = { id: 1, title: 'Test Todo', completed: false, userId: 1 };
      mockedTodoRepository.getByUserIdAndId.mockResolvedValue(expectedResult as any);

      const result = await todoService.getById(id, userId);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('create', () => {
    it('should call todoRepository.create with correct parameters', async () => {
      const title = 'Test Todo';
      const userId = 1;

      await todoService.create(title, userId);

      expect(mockedTodoRepository.create).toHaveBeenCalledWith(title, userId);
    });

    it('should return the result of todoRepository.create', async () => {
      const title = 'Test Todo';
      const userId = 1;
      const expectedResult = { id: 1, title: 'Test Todo', completed: false, userId: 1 };
      mockedTodoRepository.create.mockResolvedValue(expectedResult as any);

      const result = await todoService.create(title, userId);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('update', () => {
    it('should call todoRepository.update with correct parameters', async () => {
      const id = 1;
      const completed = true;
      const userId = 1;

      await todoService.update(id, completed, userId);

      expect(mockedTodoRepository.update).toHaveBeenCalledWith(id, completed, userId);
    });

    it('should return the result of todoRepository.update', async () => {
      const id = 1;
      const completed = true;
      const userId = 1;
      const expectedResult = { id: 1, title: 'Test Todo', completed: true, userId: 1 };
      mockedTodoRepository.update.mockResolvedValue(expectedResult as any);

      const result = await todoService.update(id, completed, userId);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('delete', () => {
    it('should call todoRepository.delete with correct parameters', async () => {
      const id = 1;
      const userId = 1;

      await todoService.delete(id, userId);

      expect(mockedTodoRepository.delete).toHaveBeenCalledWith(id, userId);
    });

    it('should return the result of todoRepository.delete', async () => {
      const id = 1;
      const userId = 1;
      const expectedResult = true;
      mockedTodoRepository.delete.mockResolvedValue(expectedResult);

      const result = await todoService.delete(id, userId);

      expect(result).toEqual(expectedResult);
    });
  });
});