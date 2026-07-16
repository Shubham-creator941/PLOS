import { Request } from 'express';

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: unknown[];
}

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role?: string;
  };
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface BaseEntity {
  createdAt: Date;
  updatedAt: Date;
  version?: number;
}
