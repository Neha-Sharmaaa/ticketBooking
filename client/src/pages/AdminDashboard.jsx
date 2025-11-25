import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { getEvents, getAnalytics, getAdminBookings, createEvent, createSession, deleteEvent } from '../services/api';

function Sidebar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <aside className="admin-sidebar">
      <h2 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
        Admin Panel
      </h2>
      <nav className="admin-nav">
        <Link to="/admin" className={`admin-nav-item ${isActive('/admin') && location.pathname === '/admin' ? 'active' : ''}`}>
          Dashboard
        </Link>
        <Link to="/admin/events" className={`admin-nav-item ${isActive('/admin/events') ? 'active' : ''}`}>
          Events
        </Link>
        <Link to="/admin/bookings" className={`admin-nav-item ${isActive('/admin/bookings') ? 'active' : ''}`}>
          Bookings
        </Link>
      </nav>
    </aside>
  );
}

function Dashboard() {
  const { data: analytics } = useQuery({ queryKey: ['analytics'], queryFn: getAnalytics });

  return (
    <div>
      <h1 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '2rem' }}>Dashboard</h1>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{analytics?.totalBookings || 0}</div>
          <div className="stat-label">Total Bookings</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: 'var(--success)' }}>{analytics?.confirmedBookings || 0}</div>
          <div className="stat-label">Confirmed</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{analytics?.events?.length || 0}</div>
          <div className="stat-label">Events</div>
        </div>
      </div>
      <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>Event Performance</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {analytics?.events?.map((event) => (
          <div key={event.id} className="card" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between' }}>
            <span>{event.title}</span>
            <span style={{ color: 'var(--text-secondary)' }}>{event.confirmedBookings} bookings</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function EventsManager() {
  const queryClient = useQueryClient();
  const { data: events } = useQuery({ queryKey: ['events'], queryFn: getEvents });
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', location: '', imageUrl: '', startsAt: '', endsAt: '' });

  const createMutation = useMutation({
    mutationFn: createEvent,
    onSuccess: () => {
      queryClient.invalidateQueries(['events']);
      setShowForm(false);
      setForm({ title: '', description: '', location: '', imageUrl: '', startsAt: '', endsAt: '' });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => queryClient.invalidateQueries(['events'])
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: '700' }}>Events</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Create Event'}
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
          <form onSubmit={(e) => { e.preventDefault(); createMutation.mutate(form); }}>
            <div className="form-group">
              <label className="form-label">Title</label>
              <input className="form-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea className="form-input" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Location</label>
                <input className="form-input" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Image URL</label>
                <input className="form-input" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Starts At</label>
                <input type="datetime-local" className="form-input" value={form.startsAt} onChange={(e) => setForm({ ...form, startsAt: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label">Ends At</label>
                <input type="datetime-local" className="form-input" value={form.endsAt} onChange={(e) => setForm({ ...form, endsAt: e.target.value })} />
              </div>
            </div>
            <button type="submit" className="btn btn-primary" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Creating...' : 'Create Event'}
            </button>
          </form>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {events?.map((event) => (
          <div key={event.id} className="card" style={{ padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontWeight: '600' }}>{event.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                {new Date(event.startsAt).toLocaleDateString()} • {event.sessions?.length || 0} sessions
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Link to={`/admin/events/${event.id}/sessions`} className="btn btn-secondary">Add Session</Link>
              <button className="btn btn-ghost" style={{ color: 'var(--error)' }} onClick={() => deleteMutation.mutate(event.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SessionCreator() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    eventId: parseInt(window.location.pathname.split('/')[3]),
    title: '',
    startsAt: '',
    endsAt: '',
    rows: 'A,B,C,D,E',
    seatsPerRow: 10,
    vipRows: 'A,B',
    generalPrice: 50,
    vipPrice: 100
  });

  const mutation = useMutation({
    mutationFn: createSession,
    onSuccess: () => {
      queryClient.invalidateQueries(['events']);
      alert('Session created!');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({
      ...form,
      rows: form.rows.split(',').map((r) => r.trim()),
      vipRows: form.vipRows.split(',').map((r) => r.trim())
    });
  };

  return (
    <div>
      <h1 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '2rem' }}>Create Session</h1>
      <div className="card" style={{ padding: '1.5rem', maxWidth: '600px' }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Session Title</label>
            <input className="form-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Starts At</label>
              <input type="datetime-local" className="form-input" value={form.startsAt} onChange={(e) => setForm({ ...form, startsAt: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Ends At</label>
              <input type="datetime-local" className="form-input" value={form.endsAt} onChange={(e) => setForm({ ...form, endsAt: e.target.value })} required />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Rows (comma-separated)</label>
              <input className="form-input" value={form.rows} onChange={(e) => setForm({ ...form, rows: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Seats per Row</label>
              <input type="number" className="form-input" value={form.seatsPerRow} onChange={(e) => setForm({ ...form, seatsPerRow: parseInt(e.target.value) })} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">VIP Rows (comma-separated)</label>
            <input className="form-input" value={form.vipRows} onChange={(e) => setForm({ ...form, vipRows: e.target.value })} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">General Price ($)</label>
              <input type="number" className="form-input" value={form.generalPrice} onChange={(e) => setForm({ ...form, generalPrice: parseFloat(e.target.value) })} />
            </div>
            <div className="form-group">
              <label className="form-label">VIP Price ($)</label>
              <input type="number" className="form-input" value={form.vipPrice} onChange={(e) => setForm({ ...form, vipPrice: parseFloat(e.target.value) })} />
            </div>
          </div>
          <button type="submit" className="btn btn-primary" disabled={mutation.isPending}>
            {mutation.isPending ? 'Creating...' : 'Create Session with Seats'}
          </button>
        </form>
      </div>
    </div>
  );
}

function BookingsManager() {
  const { data: bookings } = useQuery({ queryKey: ['adminBookings'], queryFn: getAdminBookings });

  return (
    <div>
      <h1 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '2rem' }}>All Bookings</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {bookings?.map((booking) => (
          <div key={booking.id} className="card" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontWeight: '600' }}>{booking.user?.email}</p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                {booking.session?.event?.title} - {booking.session?.title}
              </p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                Row {booking.seat?.row}, Seat {booking.seat?.number}
              </p>
            </div>
            <span className={`booking-status ${booking.status.toLowerCase()}`}>{booking.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <div className="admin-layout">
      <Sidebar />
      <main className="admin-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/events" element={<EventsManager />} />
          <Route path="/events/:id/sessions" element={<SessionCreator />} />
          <Route path="/bookings" element={<BookingsManager />} />
        </Routes>
      </main>
    </div>
  );
}

