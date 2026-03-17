import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Event 1: Cultural Dance Festival
  const event1 = await prisma.event.create({
    data: {
      title: 'Rang Mahotsav: Cultural Dance Festival',
      description: 'A vibrant celebration of traditional and contemporary dance from across India. Featuring Bharatanatyam, Kathak, and Bollywood fusion performances under the stars.',
      location: 'Heritage Amphitheatre, Jaipur',
      imageUrl: 'https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=800',
      startsAt: new Date('2026-04-18T17:00:00'),
      endsAt: new Date('2026-04-18T23:00:00'),
      sessions: {
        create: [
          {
            title: 'Classical Dance Showcase',
            startsAt: new Date('2026-04-18T17:00:00'),
            endsAt: new Date('2026-04-18T19:30:00'),
            seats: {
              create: generateSeats('s10', ['A', 'B', 'C', 'D', 'E'], 10, ['A', 'B'], 200, 100)
            }
          },
          {
            title: 'Bollywood Fusion Night',
            startsAt: new Date('2026-04-18T20:00:00'),
            endsAt: new Date('2026-04-18T23:00:00'),
            seats: {
              create: generateSeats('s11', ['A', 'B', 'C', 'D', 'E'], 10, ['A', 'B'], 250, 120)
            }
          }
        ]
      }
    }
  });
  console.log(`✅ Created event: ${event1.title}`);

  // Event 2: Indie Music & Food Carnival
  const event2 = await prisma.event.create({
    data: {
      title: 'SoundBite: Indie Music & Food Carnival',
      description: 'An unforgettable weekend blending indie music, craft cocktails, and gourmet street food. Featuring 12+ indie artists and 30+ food stalls.',
      location: 'Sunset Beach Arena, Goa',
      imageUrl: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800',
      startsAt: new Date('2026-05-09T16:00:00'),
      endsAt: new Date('2026-05-10T23:00:00'),
      sessions: {
        create: [
          {
            title: 'Day 1 - Acoustic Sunset Sessions',
            startsAt: new Date('2026-05-09T16:00:00'),
            endsAt: new Date('2026-05-09T22:00:00'),
            seats: {
              create: generateSeats('s12', ['A', 'B', 'C', 'D'], 12, ['A'], 180, 90)
            }
          },
          {
            title: 'Day 2 - Electric Night Finale',
            startsAt: new Date('2026-05-10T17:00:00'),
            endsAt: new Date('2026-05-10T23:00:00'),
            seats: {
              create: generateSeats('s13', ['A', 'B', 'C', 'D'], 12, ['A'], 220, 110)
            }
          }
        ]
      }
    }
  });
  console.log(`✅ Created event: ${event2.title}`);

  // Event 3: Stand-Up Comedy Night
  const event3 = await prisma.event.create({
    data: {
      title: 'LaughRiot: Stand-Up Comedy Extravaganza',
      description: 'Get ready for a night of non-stop laughter with top comedians performing their best 30-minute sets. Featuring surprise celebrity guest comedians!',
      location: 'The Comedy Club, Mumbai',
      imageUrl: 'https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=800',
      startsAt: new Date('2026-06-06T19:00:00'),
      endsAt: new Date('2026-06-06T23:30:00'),
      sessions: {
        create: [
          {
            title: 'Opening Acts',
            startsAt: new Date('2026-06-06T19:00:00'),
            endsAt: new Date('2026-06-06T21:00:00'),
            seats: {
              create: generateSeats('s14', ['A', 'B', 'C'], 8, ['A'], 300, 150)
            }
          },
          {
            title: 'Headliner Show',
            startsAt: new Date('2026-06-06T21:30:00'),
            endsAt: new Date('2026-06-06T23:30:00'),
            seats: {
              create: generateSeats('s15', ['A', 'B', 'C'], 8, ['A'], 500, 250)
            }
          }
        ]
      }
    }
  });
  console.log(`✅ Created event: ${event3.title}`);

  console.log('\n🎉 All 3 events created successfully!');
}

let globalCounter = 5000;
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
