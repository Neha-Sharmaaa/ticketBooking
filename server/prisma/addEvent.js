import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create sample events
  const event4 = await prisma.event.create({
    data: {
      title: 'Neon Nights: Cyberpunk Art Exhibition',
      description: 'Immerse yourself in a futuristic art showcase featuring digital media, light installations, and interactive VR experiences.',
      location: 'The Digital Arts Museum',
      imageUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=800',
      startsAt: new Date('2026-08-15T18:00:00'),
      endsAt: new Date('2026-08-30T22:00:00'),
      sessions: {
        create: [
          {
            title: 'Opening Night Gala',
            startsAt: new Date('2026-08-15T18:00:00'),
            endsAt: new Date('2026-08-15T22:00:00'),
            seats: {
              create: generateSeats('s7', ['A', 'B', 'C', 'D'], 10, ['A'], 150, 75)
            }
          },
          {
            title: 'Weekend VR Special',
            startsAt: new Date('2026-08-22T12:00:00'),
            endsAt: new Date('2026-08-22T20:00:00'),
            seats: {
              create: generateSeats('s8', ['A', 'B', 'C', 'D'], 10, ['A'], 100, 50)
            }
          }
        ]
      }
    }
  });

  console.log('Seed data for event 4 created successfully!');
}

let globalCounter = 2000;
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
