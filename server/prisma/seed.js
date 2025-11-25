import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: { email: 'admin@example.com', password: adminPassword, name: 'Admin', role: 'ADMIN' }
  });

  // Create test user
  const userPassword = await bcrypt.hash('user123', 10);
  await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: { email: 'user@example.com', password: userPassword, name: 'Test User', role: 'USER' }
  });

  // Create sample events
  const event1 = await prisma.event.create({
    data: {
      title: 'Summer Music Festival 2025',
      description: 'A three-day music extravaganza featuring top artists from around the world.',
      location: 'Central Park Amphitheater',
      imageUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800',
      startsAt: new Date('2025-07-15T18:00:00'),
      endsAt: new Date('2025-07-17T23:00:00'),
      sessions: {
        create: [
          {
            title: 'Opening Night - Rock Legends',
            startsAt: new Date('2025-07-15T18:00:00'),
            endsAt: new Date('2025-07-15T23:00:00'),
            seats: {
              create: generateSeats('s1', ['A', 'B', 'C', 'D', 'E'], 10, ['A', 'B'], 150, 75)
            }
          },
          {
            title: 'Day 2 - Electronic Beats',
            startsAt: new Date('2025-07-16T18:00:00'),
            endsAt: new Date('2025-07-16T23:00:00'),
            seats: {
              create: generateSeats('s2', ['A', 'B', 'C', 'D', 'E'], 10, ['A', 'B'], 150, 75)
            }
          }
        ]
      }
    }
  });

  const event2 = await prisma.event.create({
    data: {
      title: 'Tech Innovation Workshop',
      description: 'Learn about the latest in AI, blockchain, and web development.',
      location: 'Innovation Hub, Downtown',
      imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
      startsAt: new Date('2025-08-20T09:00:00'),
      endsAt: new Date('2025-08-20T17:00:00'),
      sessions: {
        create: [
          {
            title: 'AI & Machine Learning Masterclass',
            startsAt: new Date('2025-08-20T09:00:00'),
            endsAt: new Date('2025-08-20T12:00:00'),
            seats: {
              create: generateSeats('s3', ['A', 'B', 'C'], 8, [], 50, 50)
            }
          },
          {
            title: 'Web3 & Blockchain Workshop',
            startsAt: new Date('2025-08-20T14:00:00'),
            endsAt: new Date('2025-08-20T17:00:00'),
            seats: {
              create: generateSeats('s4', ['A', 'B', 'C'], 8, [], 50, 50)
            }
          }
        ]
      }
    }
  });

  console.log('Seed data created successfully!');
  console.log('Admin login: admin@example.com / admin123');
  console.log('User login: user@example.com / user123');
}

let globalCounter = 0;
function generateSeats(sessionPrefix, rows, seatsPerRow, vipRows, vipPrice, generalPrice) {
  const seats = [];
  for (const row of rows) {
    for (let i = 1; i <= seatsPerRow; i++) {
      seats.push({
        row,
        number: i,
        type: vipRows.includes(row) ? 'VIP' : 'GENERAL',
        price: vipRows.includes(row) ? vipPrice : generalPrice,
        uniqueKey: `${sessionPrefix}_${row}_${i}_${globalCounter++}`
      });
    }
  }
  return seats;
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

