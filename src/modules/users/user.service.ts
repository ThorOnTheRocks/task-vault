import { UserRepository } from './user.repository';
import { hashPassword } from '../../utils/hash-password';
import { CreateUserDTO } from './dto/create-user.dto';
import { User } from '../../generated';

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
}
