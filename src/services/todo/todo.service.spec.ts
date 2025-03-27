import 'reflect-metadata';
import TodoService from './todo.service';
import TodoRepository from '~/repositories/todo.repository';
import { createMock } from '@golevelup/ts-jest';
import { container, DependencyContainer } from 'tsyringe';

describe('TodoService', () => {
  let todoService: TodoService;
  let childContainer: DependencyContainer;
  let todoRepositoryMock: TodoRepository;

  beforeEach(() => {
    childContainer = container.createChildContainer();
    childContainer.register(TodoRepository, { useValue: createMock<TodoRepository>() });
    childContainer.register(TodoService, { useClass: TodoService });

    todoService = childContainer.resolve(TodoService);
    todoRepositoryMock = childContainer.resolve(TodoRepository);
  });

  describe('search', () => {
    it('should call todoRepository.search with correct parameters', async () => {
      const userId = 1;
      const limit = 10;
      const offset = 0;
      const searchMock = jest.spyOn(todoRepositoryMock, 'search');

      await todoService.search(userId, limit, offset);

      expect(searchMock).toHaveBeenCalledWith(userId, limit, offset);
    });

    it('should return the result of todoRepository.search', async () => {
      const userId = 1;
      const limit = 10;
      const offset = 0;
      const expectedResult = { rows: [], count: 0 };
      jest.spyOn(todoRepositoryMock, 'search').mockResolvedValue(expectedResult);

      const result = await todoService.search(userId, limit, offset);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('getById', () => {
    it('should call todoRepository.getByUserIdAndId with correct parameters', async () => {
      const id = 1;
      const userId = 1;
      const getByUserIdAndIdMock = jest.spyOn(todoRepositoryMock, 'getByUserIdAndId');

      await todoService.getById(id, userId);

      expect(getByUserIdAndIdMock).toHaveBeenCalledWith(id, userId);
    });

    it('should return the result of todoRepository.getByUserIdAndId', async () => {
      const id = 1;
      const userId = 1;
      const expectedResult = { id: 1, title: 'Test Todo', completed: false, userId: 1 };
      jest.spyOn(todoRepositoryMock, 'getByUserIdAndId').mockResolvedValue(expectedResult as any);

      const result = await todoService.getById(id, userId);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('create', () => {
    it('should call todoRepository.create with correct parameters', async () => {
      const title = 'Test Todo';
      const userId = 1;
      const createMock = jest.spyOn(todoRepositoryMock, 'create');

      await todoService.create(title, userId);

      expect(createMock).toHaveBeenCalledWith(title, userId);
    });

    it('should return the result of todoRepository.create', async () => {
      const title = 'Test Todo';
      const userId = 1;
      const expectedResult = { id: 1, title: 'Test Todo', completed: false, userId: 1 };
      jest.spyOn(todoRepositoryMock, 'create').mockResolvedValue(expectedResult as any);

      const result = await todoService.create(title, userId);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('update', () => {
    it('should call todoRepository.update with correct parameters', async () => {
      const id = 1;
      const completed = true;
      const userId = 1;
      const updateMock = jest.spyOn(todoRepositoryMock, 'update');

      await todoService.update(id, completed, userId);

      expect(updateMock).toHaveBeenCalledWith(id, completed, userId);
    });

    it('should return the result of todoRepository.update', async () => {
      const id = 1;
      const completed = true;
      const userId = 1;
      const expectedResult = { id: 1, title: 'Test Todo', completed: true, userId: 1 };
      jest.spyOn(todoRepositoryMock, 'update').mockResolvedValue(expectedResult as any);

      const result = await todoService.update(id, completed, userId);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('delete', () => {
    it('should call todoRepository.delete with correct parameters', async () => {
      const id = 1;
      const userId = 1;
      const deleteMock = jest.spyOn(todoRepositoryMock, 'delete');

      await todoService.delete(id, userId);

      expect(deleteMock).toHaveBeenCalledWith(id, userId);
    });

    it('should return the result of todoRepository.delete', async () => {
      const id = 1;
      const userId = 1;
      const expectedResult = true;
      jest.spyOn(todoRepositoryMock, 'delete').mockResolvedValue(expectedResult);

      const result = await todoService.delete(id, userId);

      expect(result).toEqual(expectedResult);
    });
  });
});