import { PrismaClient, TaskStatus } from '../src/generated/index.js';
import { faker } from '@faker-js/faker';
import { hashPassword } from '../src/utils/hash-password';

const prisma = new PrismaClient();

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
    const username = faker.internet.username();
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
        username,
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
