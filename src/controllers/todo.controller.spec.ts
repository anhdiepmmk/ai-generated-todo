import 'reflect-metadata';
import { container } from 'tsyringe'; // Import container
import 'reflect-metadata';
import { Request, Response } from 'express';
import TodoController from './todo.controller';
import TodoService from '../services/todo.service';
import createHttpError from 'http-errors';
import { getPaginationResult } from '../utils/pagination';
import { createMock } from '@golevelup/ts-jest';

jest.mock('../utils/pagination');

describe('TodoController', () => {
  let todoController: TodoController;
  const mockedTodoService = createMock<TodoService>();
  const mockedGetPaginationResult = getPaginationResult as jest.MockedFunction<typeof getPaginationResult>;
  let mockRequest: Request;
  let mockResponse: Response;
  let mockNext: jest.Mock; // Add mockNext

  beforeEach(() => {
    container.register(TodoService, { useValue: mockedTodoService }); // Register mocked TodoService in container
    todoController = container.resolve(TodoController); // Resolve TodoController from container
    jest.clearAllMocks();
    mockRequest = { query: {} } as Request;
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
      locals: {},
    } as unknown as Response;
    mockNext = jest.fn(); // Initialize mockNext
  });

  describe('search', () => {
    it('should call todoService.search and return paginated results', async () => {
      const todos = [{ id: 1, title: 'Test Todo', completed: false, userId: 1 }];
      const count = 1;
      mockedTodoService.search.mockResolvedValue({ rows: todos as any, count });
      mockedGetPaginationResult.mockReturnValue({ todos, pagination: { page: 1, limit: 10, totalItems: count, totalPages: 1 } });
      mockRequest.user = { id: 1 };

      await todoController.search(mockRequest, mockResponse);

      expect(mockedTodoService.search).toHaveBeenCalledWith(1, 10, 0);
      expect(mockResponse.json).toHaveBeenCalledWith({ todos, pagination: { page: 1, limit: 10, totalItems: count, totalPages: 1 } });
    });
  
    describe('getById', () => {
      it('should call todoService.getById and return todo if found', async () => {
        const todo = { id: 1, title: 'Test Todo', completed: false, userId: 1 } as any;
        mockedTodoService.getById.mockResolvedValue(todo as any);
        mockRequest.params = { id: '1' };
        mockRequest.user = { id: 1 };
  
        await todoController.getById(mockRequest, mockResponse);
  
        expect(mockedTodoService.getById).toHaveBeenCalledWith(1, 1);
        expect(mockResponse.json).toHaveBeenCalledWith(todo);
      });
  
      it('should throw NotFound error if todo not found', async () => {
        mockedTodoService.getById.mockResolvedValue(null);
        mockRequest.params = { id: '1' };
        mockRequest.user = { id: 1 };
  
        await expect(todoController.getById(mockRequest, mockResponse)).rejects.toThrow(createHttpError.NotFound);
      });
    
      describe('create', () => {
        it('should call todoService.create and return new todo', async () => {
          const newTodo = { id: 2, title: 'New Todo', completed: false, userId: 1 } as any;
          mockedTodoService.create.mockResolvedValue(newTodo as any);
          mockRequest.body = { title: 'New Todo' };
          mockRequest.user = { id: 1 };
    
          await todoController.create(mockRequest, mockResponse);
    
          expect(mockedTodoService.create).toHaveBeenCalledWith('New Todo', 1);
          expect(mockResponse.status).toHaveBeenCalledWith(201);
          expect(mockResponse.json).toHaveBeenCalledWith(newTodo);
        });
      
        describe('update', () => {
          it('should call todoService.update and return updated todo if found', async () => {
            const updatedTodo = { id: 1, title: 'Updated Todo', completed: true, userId: 1 } as any;
            mockedTodoService.update.mockResolvedValue(updatedTodo as any);
            mockRequest.params = { id: '1' };
            mockRequest.body = { completed: 'true' };
            mockRequest.user = { id: 1 };
      
            await todoController.update(mockRequest, mockResponse);
      
            expect(mockedTodoService.update).toHaveBeenCalledWith(1, true, 1);
            expect(mockResponse.json).toHaveBeenCalledWith(updatedTodo);
          });
      
          it('should throw NotFound error if todo not found for update', async () => {
            mockedTodoService.update.mockResolvedValue(null);
            mockRequest.params = { id: '1' };
            mockRequest.body = { completed: 'true' };
            mockRequest.user = { id: 1 };
      
            await expect(todoController.update(mockRequest, mockResponse)).rejects.toThrow(createHttpError.NotFound);
          });
        
          describe('delete', () => {
            it('should call todoService.delete and send 204 if todo deleted', async () => {
              mockedTodoService.delete.mockResolvedValue(true);
              mockRequest.params = { id: '1' };
              mockRequest.user = { id: 1 };
        
              await todoController.delete(mockRequest, mockResponse);
        
              expect(mockedTodoService.delete).toHaveBeenCalledWith(1, 1);
              expect(mockResponse.status).toHaveBeenCalledWith(204);
              expect(mockResponse.send).toHaveBeenCalled();
            });
        
            it('should throw NotFound error if todo not found for delete', async () => {
              mockedTodoService.delete.mockResolvedValue(false);
              mockRequest.params = { id: '1' };
              mockRequest.user = { id: 1 };
        
              await expect(todoController.delete(mockRequest, mockResponse)).rejects.toThrow(createHttpError.NotFound);
            });
          });
        });
      });
    });
  });
});