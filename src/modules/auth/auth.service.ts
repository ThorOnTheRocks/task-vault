import jwt, { type Secret, type SignOptions } from 'jsonwebtoken';
import { comparePassword, hashPassword } from '../../utils/hash-password';
import { config } from '../../core/config/envs';
import { UserRepository } from '../users/user.repository';
import { LoginDTO } from './dto/login.dto';
import { RegisterUserDTO } from './dto/register-user.dto';

interface JWTPayload {
  userId: number;
}

export class AuthService {
  private readonly JWT_SECRET: Secret;
  private readonly JWT_EXPIRES_IN: SignOptions['expiresIn'];
  constructor(private userRepository: UserRepository) {
    this.JWT_SECRET = config.jwtSecret as Secret;
    this.JWT_EXPIRES_IN = (config.jwtExpiresIn ||
      '7d') as SignOptions['expiresIn'];
  }

  async register(registerUserDTO: RegisterUserDTO) {
    const { name, username, email, password } = registerUserDTO;
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('Email already registered!');
    }

    const hashedPassword = await hashPassword(password);
    const user = await this.userRepository.create(
      name,
      username,
      email,
      hashedPassword,
    );

    return {
      name: user.name,
      email: user.email,
      username: user.username,
      created_at: user.createdAt,
    };
  }

  async login(loginDTO: LoginDTO) {
    const { email, password } = loginDTO;
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isValidPassword = await comparePassword(password, user.password);

    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    const payload: JWTPayload = {
      userId: user.id,
    };

    const token = jwt.sign(payload, this.JWT_SECRET, {
      expiresIn: this.JWT_EXPIRES_IN,
    });

    return {
      token,
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }

  verifyToken(token: string): JWTPayload {
    try {
      const decoded = jwt.verify(token, this.JWT_SECRET) as JWTPayload;
      return decoded;
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }
}
