import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'neha.k@adypu.edu.in' },
    update: { role: 'ADMIN', password: adminPassword },
    create: { email: 'neha.k@adypu.edu.in', password: adminPassword, name: 'Admin', role: 'ADMIN' }
  });
  console.log('Admin user neha.k@adypu.edu.in created/updated with password admin123');
}

main().finally(() => prisma.$disconnect());
