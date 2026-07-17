import { success, created } from './response';
import { Response } from 'express';

describe('Response Shared Helpers', () => {
  let mockRes: Partial<Response>;

  beforeEach(() => {
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  it('should return a 200 success response', () => {
    success(mockRes as Response, { user: 'test' }, 'Operation successful');
    
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: true,
      message: 'Operation successful',
      data: { user: 'test' }
    });
  });

  it('should return a 201 created response', () => {
    created(mockRes as Response, { id: '123' }, 'Resource created');
    
    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: true,
      message: 'Resource created',
      data: { id: '123' }
    });
  });
});
