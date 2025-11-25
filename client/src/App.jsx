import { Routes, Route, Link, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import EventList from './pages/EventList';
import EventDetail from './pages/EventDetail';
import SessionBooking from './pages/SessionBooking';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';

function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading"><div className="spinner"></div></div>;
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && user.role !== 'ADMIN') return <Navigate to="/" />;
  return children;
}

export default function App() {
  const { user, logout, loading } = useAuth();

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  return (
    <>
      <nav className="navbar">
        <div className="container navbar-content">
          <Link to="/" className="logo">CultureTix</Link>
          <div className="nav-links">
            <Link to="/" className="nav-link">Events</Link>
            {user ? (
              <>
                <Link to="/profile" className="nav-link">My Bookings</Link>
                {user.role === 'ADMIN' && (
                  <Link to="/admin" className="nav-link">Admin</Link>
                )}
                <button onClick={logout} className="btn btn-ghost">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link">Login</Link>
                <Link to="/register" className="btn btn-primary">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<EventList />} />
        <Route path="/events/:id" element={<EventDetail />} />
        <Route path="/sessions/:id" element={<SessionBooking />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/admin/*" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
      </Routes>
    </>
  );
}

