import { Request, Response, NextFunction } from 'express';

export const createMockContext = () => {
  let mockRequest: Request;
  let mockResponse: Response;
  let mockNext: NextFunction;

  mockRequest = { query: {}, params: {}, body: {}, user: { id: 1 } } as unknown as Request;
  mockResponse = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
    send: jest.fn(),
    locals: {},
  } as unknown as Response;
  mockNext = jest.fn() as NextFunction;

  return { mockRequest, mockResponse, mockNext };
};