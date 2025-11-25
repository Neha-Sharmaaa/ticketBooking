import { Router } from 'express';
import prisma from '../utils/prisma.js';

const router = Router();

router.get('/:id', async (req, res) => {
  const session = await prisma.session.findUnique({
    where: { id: parseInt(req.params.id) },
    include: { event: true }
  });
  if (!session) return res.status(404).json({ error: 'Session not found' });
  res.json(session);
});

router.get('/:id/seats', async (req, res) => {
  const sessionId = parseInt(req.params.id);
  const now = new Date();

  const seats = await prisma.seat.findMany({
    where: { sessionId },
    include: {
      bookings: {
        where: {
          OR: [
            { status: 'CONFIRMED' },
            { status: 'PENDING', holdUntil: { gt: now } }
          ]
        },
        select: { id: true, status: true, holdUntil: true }
      }
    },
    orderBy: [{ row: 'asc' }, { number: 'asc' }]
  });

  const seatsWithStatus = seats.map((seat) => {
    const confirmedBooking = seat.bookings.find((b) => b.status === 'CONFIRMED');
    const heldBooking = seat.bookings.find((b) => b.status === 'PENDING');
    return {
      id: seat.id,
      row: seat.row,
      number: seat.number,
      type: seat.type,
      price: seat.price,
      status: confirmedBooking ? 'BOOKED' : heldBooking ? 'HELD' : 'AVAILABLE'
    };
  });

  res.json(seatsWithStatus);
});

export default router;

