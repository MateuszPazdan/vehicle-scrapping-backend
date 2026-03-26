import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !password) {
    throw new Error('credentials are not set in .env');
  }

  const hashedPassword = await hash(password, 10);

  await prisma.user.create({
    data: {
      email: adminEmail,
      hashedPassword,
      roles: ['ADMIN', 'EMPLOYEE', 'USER'],
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
