import { Router } from 'express';
import {
  loginUserSchema,
  registerUserSchema,
} from '../../validation/auth-validation';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserRepository } from '../users/user.repository';
import { PrismaClient } from '../../generated';
import { validateData } from '../../core/middlewares/validation-middleware';

const router = Router();

const prisma = new PrismaClient();
const userRepository = new UserRepository(prisma);
const authService = new AuthService(userRepository);
const authController = new AuthController(authService);

router.post(
  '/register',
  validateData(registerUserSchema),
  authController.register.bind(authController),
);

router.post(
  '/login',
  validateData(loginUserSchema),
  authController.login.bind(authController),
);

export { router as authRouter };
