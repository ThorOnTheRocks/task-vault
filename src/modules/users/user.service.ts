import { UserRepository } from './user.repository';
import { hashPassword } from '../../utils/hash-password';
import { CreateUserDTO } from './dto/create-user.dto';
import { User } from '../../generated';
import { UpdateUserDTO } from './dto/update-user.dto';

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(createUserDto: CreateUserDTO): Promise<Partial<User>> {
    const { name, username, email, password } = createUserDto;
    const hashedPassword = await hashPassword(password);

    const user = await this.userRepository.create(
      name,
      username,
      email,
      hashedPassword,
    );

    return {
      name: user.name,
      username: user.username,
      email: user.email,
    };
  }

  async getAllUsers(): Promise<Partial<User>[]> {
    const users = await this.userRepository.findAll();

    return users.map(({ id, name, username, email, createdAt, updatedAt }) => ({
      id,
      name,
      username,
      email,
      createdAt,
      updatedAt,
    }));
  }

  async updateUser(
    id: string,
    updateUserDTO: UpdateUserDTO,
  ): Promise<Partial<User>> {
    const user = await this.userRepository.update(Number(id), updateUserDTO);

    return {
      name: user?.name,
      username: user?.username,
      email: user?.email,
    };
  }

  async findUser(id: string): Promise<User | null> {
    const user = await this.userRepository.findById(Number(id));
    if (!user) return null;
    return user;
  }

  async deleteUser(id: string): Promise<boolean> {
    return await this.userRepository.delete(Number(id));
  }
}
