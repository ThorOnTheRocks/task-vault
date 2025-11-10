import { Router } from 'express';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { PrismaClient } from '../../generated';
import { validateData } from '../../core/middlewares/validation-middleware';
import {
  createUserSchema,
  updateUserSchema,
} from '../../validation/user-validation';

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
router.get('/users', userController.getAllUsers.bind(userController));
router.get('/users/:id', userController.getUser.bind(userController));
router.patch(
  '/users/:id',
  validateData(updateUserSchema),
  userController.updateUser.bind(userController),
);
router.delete('/users/:id', userController.deleteUser.bind(userController));

export { router as userRouter };
