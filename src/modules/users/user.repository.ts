import { User, PrismaClient } from '../../generated';

interface IUserRepository {
  create(
    name: string,
    username: string,
    email: string,
    password: string,
  ): Promise<User>;
  findAll(): Promise<User[]>;
  findById(id: number): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  update(id: number, data: Partial<User>): Promise<User | null>;
  delete(id: number): Promise<void>;
  exists(id: number): Promise<boolean>;
}

export class UserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(
    name: string,
    username: string,
    email: string,
    password: string,
  ): Promise<User> {
    const user = await this.prisma.user.create({
      data: {
        name,
        username,
        email,
        password,
      },
    });

    return user;
  }

  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany();

    return users;
  }

  async findById(id: number): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    return user;
  }

  async update(id: number, data: Partial<User>): Promise<User | null> {
    try {
      return await this.prisma.user.update({
        where: { id },
        data,
      });
    } catch (error: any) {
      if (error.code === 'P2025') return null;
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }

  async exists(id: number): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true },
    });

    return !!user;
  }
}
