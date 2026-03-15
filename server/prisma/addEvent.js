import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create sample events
  const event3 = await prisma.event.create({
    data: {
      title: 'Global Culinary Expo 2026',
      description: 'Experience the world’s finest cuisines, cooking demonstrations, and tastings from renowned chefs.',
      location: 'Metropolitan Convention Center',
      imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800',
      startsAt: new Date('2026-05-10T10:00:00'),
      endsAt: new Date('2026-05-12T18:00:00'),
      sessions: {
        create: [
          {
            title: 'Day 1 - Masterchef Live',
            startsAt: new Date('2026-05-10T10:00:00'),
            endsAt: new Date('2026-05-10T18:00:00'),
            seats: {
              create: generateSeats('s5', ['A', 'B', 'C', 'D'], 10, ['A'], 200, 100)
            }
          },
          {
            title: 'Day 2 - Pastry Wonders',
            startsAt: new Date('2026-05-11T10:00:00'),
            endsAt: new Date('2026-05-11T18:00:00'),
            seats: {
              create: generateSeats('s6', ['A', 'B', 'C', 'D'], 10, ['A'], 200, 100)
            }
          }
        ]
      }
    }
  });

  console.log('Seed data for event 3 created successfully!');
}

let globalCounter = 1000;
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
