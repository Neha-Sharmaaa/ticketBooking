import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { getSession, getSessionSeats, holdSeats, confirmBooking } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { useSocket } from '../hooks/useSocket';
import PaymentModal from '../components/PaymentModal';

export default function SessionBooking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [holdData, setHoldData] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const { data: session } = useQuery({
    queryKey: ['session', id],
    queryFn: () => getSession(id)
  });

  const { data: seats } = useQuery({
    queryKey: ['seats', id],
    queryFn: () => getSessionSeats(id)
  });

  const handleSeatUpdate = useCallback(({ seatId, status }) => {
    queryClient.setQueryData(['seats', id], (old) =>
      old?.map((s) => (s.id === seatId ? { ...s, status } : s))
    );
  }, [queryClient, id]);

  useSocket(id, handleSeatUpdate);

  const holdMutation = useMutation({
    mutationFn: holdSeats,
    onSuccess: (data) => {
      setHoldData(data);
      setTimeLeft(Math.floor((new Date(data.holdUntil) - new Date()) / 1000));
      queryClient.invalidateQueries(['seats', id]);
    }
  });

  const confirmMutation = useMutation({
    mutationFn: confirmBooking,
    onSuccess: () => {
      navigate('/profile');
    }
  });

  useEffect(() => {
    if (!holdData || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setHoldData(null);
          setSelectedSeats([]);
          queryClient.invalidateQueries(['seats', id]);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [holdData, timeLeft, queryClient, id]);

  const toggleSeat = (seat) => {
    if (seat.status !== 'AVAILABLE' || holdData) return;
    setSelectedSeats((prev) =>
      prev.find((s) => s.id === seat.id)
        ? prev.filter((s) => s.id !== seat.id)
        : [...prev, seat]
    );
  };

  const handleHold = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    holdMutation.mutate({
      sessionId: parseInt(id),
      seatIds: selectedSeats.map((s) => s.id)
    });
  };

  const handlePaymentSubmit = () => {
    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);
      setShowPaymentModal(false);

      holdData.bookingIds.forEach((bookingId) => {
        confirmMutation.mutate(bookingId);
      });
    }, 1500); // Simulate network delay
  };

  const rows = seats?.reduce((acc, seat) => {
    if (!acc[seat.row]) acc[seat.row] = [];
    acc[seat.row].push(seat);
    return acc;
  }, {}) || {};

  const total = selectedSeats.reduce((sum, s) => sum + s.price, 0);

  return (
    <div className="container animate-fade-in-up" style={{ padding: '2rem 0' }}>
      <h1 className="page-title" style={{ fontSize: '2rem', textAlign: 'left', marginBottom: '0.5rem' }}>
        {session?.title}
      </h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        {session?.event?.title} • {session && new Date(session.startsAt).toLocaleString()}
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' }}>
        <div className="seat-map">
          <div className="stage">Stage</div>
          {Object.entries(rows).map(([row, rowSeats]) => (
            <div key={row} className="seat-row">
              <span className="row-label">{row}</span>
              {rowSeats.map((seat) => {
                const isSelected = selectedSeats.find((s) => s.id === seat.id);
                return (
                  <button
                    key={seat.id}
                    className={`seat ${seat.status.toLowerCase()} ${seat.type.toLowerCase()} ${isSelected ? 'selected' : ''}`}
                    onClick={() => toggleSeat(seat)}
                    disabled={seat.status !== 'AVAILABLE' || !!holdData}
                  >
                    {seat.number}
                  </button>
                );
              })}
            </div>
          ))}
          <div className="seat-legend">
            <div className="legend-item">
              <div className="legend-dot" style={{ background: 'var(--bg-elevated)', border: '2px solid var(--border)' }}></div>
              Available
            </div>
            <div className="legend-item">
              <div className="legend-dot" style={{ background: 'var(--bg-elevated)', border: '2px solid var(--vip)' }}></div>
              VIP
            </div>
            <div className="legend-item">
              <div className="legend-dot" style={{ background: 'var(--accent)' }}></div>
              Selected
            </div>
            <div className="legend-item">
              <div className="legend-dot" style={{ background: 'var(--warning)' }}></div>
              Held
            </div>
            <div className="legend-item">
              <div className="legend-dot" style={{ background: 'var(--text-muted)' }}></div>
              Booked
            </div>
          </div>
        </div>

        <div className="booking-summary">
          <h3>Booking Summary</h3>
          {selectedSeats.length === 0 && !holdData ? (
            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem 0' }}>
              Select seats to continue
            </p>
          ) : (
            <>
              {selectedSeats.map((seat) => (
                <div key={seat.id} className="summary-row">
                  <span>Row {seat.row}, Seat {seat.number} {seat.type === 'VIP' && '(VIP)'}</span>
                  <span>${seat.price}</span>
                </div>
              ))}
              <div className="summary-row total">
                <span>Total</span>
                <span>${total}</span>
              </div>

              {holdData && (
                <div className="hold-timer">
                  <p style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>Seats held for</p>
                  <div className="time">{Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}</div>
                </div>
              )}

              {!holdData ? (
                <button
                  className="btn btn-primary"
                  style={{ width: '100%', marginTop: '1rem' }}
                  onClick={handleHold}
                  disabled={selectedSeats.length === 0 || holdMutation.isPending}
                >
                  {holdMutation.isPending ? 'Holding...' : 'Hold Seats'}
                </button>
              ) : (
                <button
                  className="btn btn-primary"
                  style={{ width: '100%', marginTop: '1rem' }}
                  onClick={() => setShowPaymentModal(true)}
                  disabled={confirmMutation.isPending}
                >
                  {confirmMutation.isPending ? 'Confirming...' : 'Confirm & Pay'}
                </button>
              )}

              {showPaymentModal && (
                <PaymentModal
                  amount={total}
                  onConfirm={handlePaymentSubmit}
                  onCancel={() => setShowPaymentModal(false)}
                  isProcessing={isProcessingPayment}
                />
              )}

              {(holdMutation.error || confirmMutation.error) && (
                <div className="error-message mt-2">
                  {holdMutation.error?.response?.data?.error || confirmMutation.error?.response?.data?.error || 'An error occurred'}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

