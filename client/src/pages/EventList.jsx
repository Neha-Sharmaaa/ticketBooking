import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getEvents } from '../services/api';

export default function EventList() {
  const { data: events, isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: getEvents
  });

  if (isLoading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  return (
    <div className="container">
      <header className="page-header">
        <h1 className="page-title">Upcoming Events</h1>
        <p className="page-subtitle">Discover festivals, workshops, and cultural experiences</p>
      </header>
      <div className="events-grid">
        {events?.map((event) => (
          <Link to={`/events/${event.id}`} key={event.id} className="card">
            <div
              className="event-card-image"
              style={{ backgroundImage: `url(${event.imageUrl || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800'})` }}
            />
            <div className="event-card-body">
              <h3 className="event-card-title">{event.title}</h3>
              <div className="event-card-meta">
                <span>📍 {event.location || 'TBA'}</span>
                <span>📅 {new Date(event.startsAt).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                <span>🎫 {event.sessions?.length || 0} sessions available</span>
              </div>
              <span className="btn btn-secondary" style={{ width: '100%' }}>View Details</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

