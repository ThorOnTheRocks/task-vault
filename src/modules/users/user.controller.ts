import type { Request, Response } from 'express';
import { UserService } from './user.service';
import { StatusCodes } from 'http-status-codes';
import { CreateUser } from '../../validation/user-validation';

export class UserController {
  constructor(private userService: UserService) {}

  async createUser(req: Request<{}, {}, CreateUser>, res: Response) {
    const { name, username, email, password } = req.body;
    try {
      const user = await this.userService.createUser({
        name,
        username,
        email,
        password,
      });
      res
        .status(StatusCodes.CREATED)
        .json({ name: user.name, email: user.email });
    } catch (error: any) {
      res.json(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }
}
