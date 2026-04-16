import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getEvents } from '../services/api';

export default function EventList() {
  const { data: events, isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: getEvents
  });

  if (isLoading) {
    return <div className="loading" aria-label="Loading events"><div className="spinner"></div></div>;
  }

  return (
    <div className="container">
      <header className="page-header animate-fade-in-up">
        <h1 className="page-title">Discover the Extraordinary</h1>
        <p className="page-subtitle">Immersive festivals, workshops, and cultural experiences await you.</p>
      </header>
      <div className="events-grid">
        {events?.filter(event => {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const endDate = new Date(event.endsAt || event.startsAt);
          return endDate >= today;
        }).map((event, index) => (
          <Link
            to={`/events/${event.id}`}
            key={event.id}
            className="card animate-fade-in-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div
              className="event-card-image"
              style={{ backgroundImage: `url(${event.imageUrl || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800'})` }}
            />
            <div className="event-card-body">
              <h3 className="event-card-title">{event.title}</h3>
              <div className="event-card-meta">
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px' }}>📍</span>
                  {event.location || 'TBA'}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px' }}>📅</span>
                  {new Date(event.startsAt).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px' }}>🎫</span>
                  {event.sessions?.length || 0} sessions available
                </span>
              </div>
              <span className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>Reserve Tickets</span>
            </div>
          </Link>
        ))}
      </div>
    </div >
  );
}
