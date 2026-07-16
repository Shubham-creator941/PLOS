import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../service/auth.service';
import { created, success } from '../../../shared/response';
import { AuthenticatedRequest } from '../../../shared/types';
import { MESSAGES } from '../../../shared/messages';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  public register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.authService.register(req.body);
      created(res, result, MESSAGES.CREATED);
    } catch (error) {
      next(error);
    }
  };

  public login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.authService.login(req.body);
      success(res, result, MESSAGES.SUCCESS);
    } catch (error) {
      next(error);
    }
  };

  public getProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user || !req.user.id) {
        throw new Error('User not authenticated');
      }
      
      const profile = await this.authService.getProfile(req.user.id);
      success(res, profile, MESSAGES.SUCCESS);
    } catch (error) {
      next(error);
    }
  };

  public logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      success(res, null, 'Logged out successfully');
    } catch (error) {
      next(error);
    }
  };
}
