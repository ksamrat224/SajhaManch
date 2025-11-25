//npx ts-node prisma/seed.ts
import { PrismaClient, Role } from '../generated/prisma';
const prisma = new PrismaClient();

async function main() {
  // Seed Users
  const alice = await prisma.user.create({
    data: {
      name: 'Alice',
      mobile: '9800000001',
      email: 'alice@example.com',
      password: 'password', 
      role: Role.USER,
    },
  });

  const bob = await prisma.user.create({
    data: {
      name: 'Bob',
      mobile: '9800000002',
      email: 'bob@example.com',
      password: 'password', 
      role: Role.ADMIN,
    },
  });

  // Seed Polls + Options
  const poll1 = await prisma.poll.create({
    data: {
      title: 'Best Programming Language',
      description: 'Vote for your favorite language.',
      isActive: true,
      endsAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), 
      options: {
        create: [{ name: 'Python' }, { name: 'JavaScript' }, { name: 'Go' }],
      },
    },
    include: { options: true },
  });

  const poll2 = await prisma.poll.create({
    data: {
      title: 'Preferred Frontend Framework',
      description: 'Choose your go-to frontend framework.',
      isActive: true,
      endsAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), 
      options: {
        create: [{ name: 'React' }, { name: 'Vue' }, { name: 'Angular' }],
      },
    },
    include: { options: true },
  });

  // Seed Votes
  await prisma.vote.create({
    data: {
      userId: alice.id,
      pollId: poll1.id,
      pollOptionId: poll1.options[0].id, 
    },
  });

  await prisma.vote.create({
    data: {
      userId: bob.id,
      pollId: poll1.id,
      pollOptionId: poll1.options[1].id, 
    },
  });

  await prisma.vote.create({
    data: {
      userId: bob.id,
      pollId: poll2.id,
      pollOptionId: poll2.options[0].id, 
    },
  });

  // Seed Feedbacks
  await prisma.feedback.create({
    data: {
      message: 'I love Python for its simplicity.',
      userId: alice.id,
      pollId: poll1.id,
    },
  });

  await prisma.feedback.create({
    data: {
      message: 'React has the best ecosystem.',
      userId: bob.id,
      pollId: poll2.id,
    },
  });

  await prisma.feedback.create({
    data: {
      message: 'Go deserves more votes!',
      pollId: poll1.id,
    },
  });

  console.log('Seed data has been inserted successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
