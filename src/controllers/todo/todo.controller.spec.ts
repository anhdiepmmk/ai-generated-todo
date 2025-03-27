import 'reflect-metadata';
import { container, DependencyContainer } from 'tsyringe';
import { Request, Response, NextFunction } from 'express';
import { createMockContext } from '../__fixtures__/createMockContext';
import TodoController from './todo.controller';
import TodoService from '~/services/todo/todo.service';
import createHttpError from 'http-errors';
import { createMock } from '@golevelup/ts-jest';

describe('TodoController', () => {
  let todoController: TodoController;
  let childContainer: DependencyContainer;
  let todoServiceMock: TodoService;
  let mockContext: {
    mockRequest: Request;
    mockResponse: Response;
    mockNext: NextFunction;
  };
  let mockRequest: Request;
  let mockResponse: Response;
  let mockNext: NextFunction;


  beforeEach(() => {
    mockContext = createMockContext();
    mockRequest = mockContext.mockRequest;
    mockResponse = mockContext.mockResponse;
    mockNext = mockContext.mockNext;
    childContainer = container.createChildContainer();
    childContainer.register(TodoService, { useValue: createMock<TodoService>() });
    childContainer.register(TodoController, { useClass: TodoController });

    todoController = childContainer.resolve(TodoController);
    todoServiceMock = childContainer.resolve(TodoService);
  });

  describe('search', () => {
    it('should call todoService.search and return paginated results', async () => {
      const todos = [{ id: 1, title: 'Test Todo', completed: false, userId: 1 }];
      const count = 1;
      const searchMock = jest.spyOn(todoServiceMock, 'search').mockResolvedValue({ rows: todos as any, count });

      await todoController.search(mockRequest, mockResponse);

      expect(searchMock).toHaveBeenCalledWith(1, 10, 0);
      expect(mockResponse.json).toHaveBeenCalledWith({ todos, pagination: { page: 1, limit: 10, totalItems: count, totalPages: 1 } });
    });
  });
  
  describe('getById', () => {
    it('should call todoService.getById and return todo if found', async () => {
      const todo = { id: 1, title: 'Test Todo', completed: false, userId: 1 } as any;
      const getByIdMock = jest.spyOn(todoServiceMock, 'getById').mockResolvedValue(todo as any);
      mockRequest.params = { id: '1' };

      await todoController.getById(mockRequest, mockResponse);
  
      expect(getByIdMock).toHaveBeenCalledWith(1, 1);
      expect(mockResponse.json).toHaveBeenCalledWith(todo);
    });
  
    it('should throw NotFound error if todo not found', async () => {
      const getByIdMock = jest.spyOn(todoServiceMock, 'getById').mockResolvedValue(null);
      mockRequest.params = { id: '1' };
  
      await expect(todoController.getById(mockRequest, mockResponse)).rejects.toThrow(createHttpError.NotFound);
    });
  });

  describe('create', () => {
    it('should call todoService.create and return new todo', async () => {
      const newTodo = { id: 2, title: 'New Todo', completed: false, userId: 1 } as any;
      const createMock = jest.spyOn(todoServiceMock, 'create').mockResolvedValue(newTodo as any);
      mockRequest.body = { title: 'New Todo' };

      await todoController.create(mockRequest, mockResponse);
  
      expect(createMock).toHaveBeenCalledWith('New Todo', 1);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(newTodo);
    });
  });
    
  describe('update', () => {
    it('should call todoService.update and return updated todo if found', async () => {
      const updatedTodo = { id: 1, title: 'Updated Todo', completed: true, userId: 1 } as any;
      const updateMock = jest.spyOn(todoServiceMock, 'update').mockResolvedValue(updatedTodo as any);
      mockRequest.params = { id: '1' };
      mockRequest.body = { completed: 'true' };
    
      await todoController.update(mockRequest, mockResponse);
    
      expect(updateMock).toHaveBeenCalledWith(1, true, 1);
      expect(mockResponse.json).toHaveBeenCalledWith(updatedTodo);
    });
    
    it('should throw NotFound error if todo not found for update', async () => {
      const updateMock = jest.spyOn(todoServiceMock, 'update').mockResolvedValue(null);
      mockRequest.params = { id: '1' };
      mockRequest.body = { completed: 'true' };
    
      await expect(todoController.update(mockRequest, mockResponse)).rejects.toThrow(createHttpError.NotFound);
    });
  });
      
  describe('delete', () => {
    it('should call todoService.delete and send 204 if todo deleted', async () => {
      const deleteMock = jest.spyOn(todoServiceMock, 'delete').mockResolvedValue(true);
      mockRequest.params = { id: '1' };
    
      await todoController.delete(mockRequest, mockResponse);
      
      expect(deleteMock).toHaveBeenCalledWith(1, 1);
      expect(mockResponse.status).toHaveBeenCalledWith(204);
      expect(mockResponse.send).toHaveBeenCalled();
    });
      
    it('should throw NotFound error if todo not found for delete', async () => {
      const deleteMock = jest.spyOn(todoServiceMock, 'delete').mockResolvedValue(false);
      mockRequest.params = { id: '1' };
    
      await expect(todoController.delete(mockRequest, mockResponse)).rejects.toThrow(createHttpError.NotFound);
    });
  });
});