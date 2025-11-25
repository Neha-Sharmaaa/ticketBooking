import { Router } from 'express';
import prisma from '../utils/prisma.js';

const router = Router();

router.get('/', async (req, res) => {
  const events = await prisma.event.findMany({
    include: { sessions: { select: { id: true, title: true, startsAt: true } } },
    orderBy: { startsAt: 'asc' }
  });
  res.json(events);
});

router.get('/:id', async (req, res) => {
  const event = await prisma.event.findUnique({
    where: { id: parseInt(req.params.id) },
    include: {
      sessions: {
        include: {
          _count: { select: { seats: true } },
          bookings: { where: { status: 'CONFIRMED' }, select: { id: true } }
        }
      }
    }
  });
  if (!event) return res.status(404).json({ error: 'Event not found' });
  res.json(event);
});

export default router;

