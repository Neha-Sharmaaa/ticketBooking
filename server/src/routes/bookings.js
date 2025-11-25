import { Router } from 'express';
import prisma from '../utils/prisma.js';
import { authenticate } from '../middlewares/auth.js';

const router = Router();

// Hold seats
router.post('/hold', authenticate, async (req, res) => {
  const { sessionId, seatIds } = req.body;
  const userId = req.user.id;
  const holdUntil = new Date(Date.now() + 5 * 60 * 1000); // 5 min hold

  try {
    const bookings = await prisma.$transaction(async (tx) => {
      // Check for conflicts
      const conflicts = await tx.booking.findFirst({
        where: {
          seatId: { in: seatIds },
          sessionId,
          OR: [
            { status: 'CONFIRMED' },
            { status: 'PENDING', holdUntil: { gt: new Date() } }
          ]
        }
      });
      if (conflicts) throw new Error('Seat unavailable');

      // Create hold bookings
      return Promise.all(
        seatIds.map((seatId) =>
          tx.booking.create({
            data: { userId, sessionId, seatId, status: 'PENDING', holdUntil }
          })
        )
      );
    });

    // Emit seat updates
    const io = req.app.get('io');
    seatIds.forEach((seatId) => {
      io.to(`session-${sessionId}`).emit('seat:update', { seatId, status: 'HELD' });
    });

    res.json({ bookingIds: bookings.map((b) => b.id), holdUntil });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Confirm booking
router.post('/:id/confirm', authenticate, async (req, res) => {
  const bookingId = parseInt(req.params.id);

  try {
    const booking = await prisma.$transaction(async (tx) => {
      const existing = await tx.booking.findFirst({
        where: { id: bookingId, userId: req.user.id, status: 'PENDING' }
      });
      if (!existing) throw new Error('Booking not found or expired');

      // Check no one else confirmed
      const conflict = await tx.booking.findFirst({
        where: { seatId: existing.seatId, status: 'CONFIRMED' }
      });
      if (conflict) throw new Error('Seat already booked');

      return tx.booking.update({
        where: { id: bookingId },
        data: { status: 'CONFIRMED', holdUntil: null },
        include: { seat: true, session: { include: { event: true } } }
      });
    });

    const io = req.app.get('io');
    io.to(`session-${booking.sessionId}`).emit('seat:update', {
      seatId: booking.seatId,
      status: 'BOOKED'
    });

    res.json(booking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Cancel booking
router.post('/:id/cancel', authenticate, async (req, res) => {
  const bookingId = parseInt(req.params.id);

  const booking = await prisma.booking.update({
    where: { id: bookingId, userId: req.user.id },
    data: { status: 'CANCELLED' }
  });

  const io = req.app.get('io');
  io.to(`session-${booking.sessionId}`).emit('seat:update', {
    seatId: booking.seatId,
    status: 'AVAILABLE'
  });

  res.json(booking);
});

// User's bookings
router.get('/my', authenticate, async (req, res) => {
  const bookings = await prisma.booking.findMany({
    where: { userId: req.user.id },
    include: {
      seat: true,
      session: { include: { event: true } }
    },
    orderBy: { createdAt: 'desc' }
  });
  res.json(bookings);
});

export default router;

