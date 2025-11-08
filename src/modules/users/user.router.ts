import { Router } from 'express';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { PrismaClient } from '../../generated';
import { validateData } from '../../core/middlewares/validation-middleware';
import { createUserSchema } from '../../validation/user-validation';

const prisma = new PrismaClient();
const userRepository = new UserRepository(prisma);
const userService = new UserService(userRepository);
const userController = new UserController(userService);

const router = Router();

router.post(
  '/users',
  validateData(createUserSchema),
  userController.createUser.bind(userController),
);

export { router as userRouter };
