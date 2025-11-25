import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { getEvent } from '../services/api';

export default function EventDetail() {
  const { id } = useParams();
  const { data: event, isLoading } = useQuery({
    queryKey: ['event', id],
    queryFn: () => getEvent(id)
  });

  if (isLoading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  if (!event) {
    return <div className="container"><p>Event not found</p></div>;
  }

  return (
    <div className="container">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', padding: '2rem 0' }}>
        <div>
          <img
            src={event.imageUrl || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800'}
            alt={event.title}
            style={{ width: '100%', borderRadius: '16px', aspectRatio: '16/10', objectFit: 'cover' }}
          />
        </div>
        <div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: '700', marginBottom: '1rem' }}>{event.title}</h1>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
            <span>📍 {event.location || 'Location TBA'}</span>
            <span>📅 {new Date(event.startsAt).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', marginBottom: '2rem' }}>
            {event.description || 'No description available.'}
          </p>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>Sessions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {event.sessions?.map((session) => {
              const totalSeats = session._count?.seats || 0;
              const bookedSeats = session.bookings?.length || 0;
              const availableSeats = totalSeats - bookedSeats;
              return (
                <div key={session.id} className="card" style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h3 style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{session.title}</h3>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        {new Date(session.startsAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} - {new Date(session.endsAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      <p style={{ color: availableSeats > 0 ? 'var(--success)' : 'var(--error)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                        {availableSeats > 0 ? `${availableSeats} seats available` : 'Sold out'}
                      </p>
                    </div>
                    <Link to={`/sessions/${session.id}`} className="btn btn-primary">
                      Book Now
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

