import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMyBookings, cancelBooking } from '../services/api';
import { useAuth } from '../hooks/useAuth';

export default function Profile() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: bookings, isLoading } = useQuery({
    queryKey: ['myBookings'],
    queryFn: getMyBookings
  });

  const cancelMutation = useMutation({
    mutationFn: cancelBooking,
    onSuccess: () => queryClient.invalidateQueries(['myBookings'])
  });

  if (isLoading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <header className="page-header" style={{ textAlign: 'left', padding: '1rem 0 2rem' }}>
        <h1 className="page-title">My Bookings</h1>
        <p className="page-subtitle">Welcome back, {user?.name || user?.email}</p>
      </header>

      {bookings?.length === 0 ? (
        <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)' }}>You haven't made any bookings yet.</p>
        </div>
      ) : (
        <div className="bookings-list">
          {bookings?.map((booking) => (
            <div key={booking.id} className="booking-item">
              <div style={{ flex: 1 }}>
                <h3 style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
                  {booking.session?.event?.title}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  {booking.session?.title}
                </p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                  {new Date(booking.session?.startsAt).toLocaleString()}
                </p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontFamily: 'Space Mono', fontWeight: '700' }}>
                  Row {booking.seat?.row}, Seat {booking.seat?.number}
                </p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  ${booking.seat?.price}
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span className={`booking-status ${booking.status.toLowerCase()}`}>
                  {booking.status}
                </span>
                {booking.status === 'CONFIRMED' && (
                  <button
                    className="btn btn-ghost"
                    onClick={() => cancelMutation.mutate(booking.id)}
                    disabled={cancelMutation.isPending}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

