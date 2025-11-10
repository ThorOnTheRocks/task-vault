import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LoginUser, RegisterUser } from '../../validation/auth-validation';
import { StatusCodes } from 'http-status-codes';

export class AuthController {
  constructor(private authService: AuthService) {}

  async register(req: Request<{}, {}, RegisterUser>, res: Response) {
    const { name, username, email, password } = req.body;
    try {
      const user = await this.authService.register({
        name,
        username,
        email,
        password,
      });
      return res.status(StatusCodes.CREATED).json({
        message: 'User created',
        user: { name: user.name, email: user.email, username: user.username },
      });
    } catch (error: any) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: 'An unexpected error occurred' });
    }
  }

  async login(req: Request<{}, {}, LoginUser>, res: Response) {
    const { email, password } = req.body;
    try {
      const user = await this.authService.login({ email, password });
      return res.status(StatusCodes.ACCEPTED).json({
        message: 'User logged in!',
        user,
      });
    } catch (error: any) {
      if (error.message === 'Invalid credentials') {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          message: 'Invalid email or password',
        });
      }
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: 'An unexpected error occurred' });
    }
  }
}
