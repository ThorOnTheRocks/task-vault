import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { PrismaClient, TaskStatus } from '../src/generated/index.js';
import { faker } from '@faker-js/faker';

const scrypt = promisify(_scrypt);

const prisma = new PrismaClient();

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex');
  const derivedKey = (await scrypt(password, salt, 64)) as Buffer;
  return `${salt}:${derivedKey.toString('hex')}`;
}

async function main() {
  const NUM_USERS = 10;
  const TASKS_PER_USER = 3;

  console.log(
    `Seeding ${NUM_USERS} users with ${TASKS_PER_USER} tasks each...`,
  );

  for (let i = 0; i < NUM_USERS; i++) {
    const name = faker.person.fullName();
    const email = faker.internet.email({
      firstName: name.split(' ')[0],
      lastName: name.split(' ')[1],
    });
    const password = await hashPassword('password12345');

    const tasks = Array.from({ length: TASKS_PER_USER }).map(() => ({
      title: faker.hacker.phrase(),
      content: faker.lorem.sentence(),
      status: faker.helpers.arrayElement([
        TaskStatus.OPEN,
        TaskStatus.IN_PROGRESS,
        TaskStatus.DONE,
        TaskStatus.ARCHIVED,
      ]),
    }));

    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        name,
        email,
        password,
        tasks: {
          create: tasks,
        },
      },
    });

    console.log(`Seeded user: ${user.name} (id: ${user.id})`);
  }

  console.log('Seeding completed ✅');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
