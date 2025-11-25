import { Router } from 'express';
import prisma from '../utils/prisma.js';
import { authenticate, requireAdmin } from '../middlewares/auth.js';

const router = Router();
router.use(authenticate, requireAdmin);

// Create event
router.post('/events', async (req, res) => {
  const { title, description, location, imageUrl, startsAt, endsAt } = req.body;
  const event = await prisma.event.create({
    data: { title, description, location, imageUrl, startsAt: new Date(startsAt), endsAt: endsAt ? new Date(endsAt) : null }
  });
  res.json(event);
});

// Update event
router.put('/events/:id', async (req, res) => {
  const { title, description, location, imageUrl, startsAt, endsAt } = req.body;
  const event = await prisma.event.update({
    where: { id: parseInt(req.params.id) },
    data: { title, description, location, imageUrl, startsAt: new Date(startsAt), endsAt: endsAt ? new Date(endsAt) : null }
  });
  res.json(event);
});

// Delete event
router.delete('/events/:id', async (req, res) => {
  await prisma.event.delete({ where: { id: parseInt(req.params.id) } });
  res.json({ success: true });
});

// Create session with seats
router.post('/sessions', async (req, res) => {
  const { eventId, title, startsAt, endsAt, rows, seatsPerRow, vipRows = [], generalPrice, vipPrice } = req.body;

  const session = await prisma.session.create({
    data: {
      eventId,
      title,
      startsAt: new Date(startsAt),
      endsAt: new Date(endsAt),
      seats: {
        create: rows.flatMap((row) =>
          Array.from({ length: seatsPerRow }, (_, i) => ({
            row,
            number: i + 1,
            type: vipRows.includes(row) ? 'VIP' : 'GENERAL',
            price: vipRows.includes(row) ? vipPrice : generalPrice,
            uniqueKey: `${Date.now()}_${row}_${i + 1}`
          }))
        )
      }
    },
    include: { seats: true }
  });
  res.json(session);
});

// Get all bookings (admin report)
router.get('/bookings', async (req, res) => {
  const bookings = await prisma.booking.findMany({
    include: {
      user: { select: { id: true, email: true, name: true } },
      seat: true,
      session: { include: { event: true } }
    },
    orderBy: { createdAt: 'desc' }
  });
  res.json(bookings);
});

// Analytics
router.get('/analytics', async (req, res) => {
  const [totalBookings, confirmedBookings, eventStats] = await Promise.all([
    prisma.booking.count(),
    prisma.booking.count({ where: { status: 'CONFIRMED' } }),
    prisma.event.findMany({
      include: {
        sessions: {
          include: {
            _count: { select: { bookings: true } },
            bookings: { where: { status: 'CONFIRMED' } }
          }
        }
      }
    })
  ]);

  res.json({
    totalBookings,
    confirmedBookings,
    events: eventStats.map((e) => ({
      id: e.id,
      title: e.title,
      totalBookings: e.sessions.reduce((sum, s) => sum + s._count.bookings, 0),
      confirmedBookings: e.sessions.reduce((sum, s) => sum + s.bookings.length, 0)
    }))
  });
});

export default router;

