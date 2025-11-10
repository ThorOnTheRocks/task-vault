import type { Request, Response } from 'express';
import { UserService } from './user.service';
import { StatusCodes } from 'http-status-codes';
import { CreateUser, UpdateUser } from '../../validation/user-validation';

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
        .status(StatusCodes.ACCEPTED)
        .json({ name: user.name, email: user.email });
    } catch (error: any) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }

  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await this.userService.getAllUsers();
      res.status(StatusCodes.OK).json(users);
    } catch (error: any) {
      console.error(error);
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }

  async updateUser(
    req: Request<{ id: string }, {}, UpdateUser>,
    res: Response,
  ) {
    const { id } = req.params;
    const { name, username, email } = req.body;
    try {
      const user = await this.userService.updateUser(id, {
        name,
        username,
        email,
      });
      res
        .status(StatusCodes.OK)
        .json({ name: user.name, username: user.username, email: user.email });
    } catch (error: any) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }

  async getUser(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params;
    try {
      const user = await this.userService.findUser(id);
      if (!user) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: 'User not found' });
      }
      return res.status(StatusCodes.OK).json({
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      });
    } catch (error: any) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  async deleteUser(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params;
    try {
      const user = await this.userService.deleteUser(id);
      if (!user) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: 'User not found' });
      }
      return res.status(StatusCodes.NO_CONTENT).send();
    } catch (error: any) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }
}
