import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { login } from '../services/api';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const auth = useAuth();

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      auth.login(data.user, data.token);
      navigate('/');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({ email, password });
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Welcome Back</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {mutation.error && (
            <div className="error-message">
              {mutation.error.response?.data?.error || 'Login failed'}
            </div>
          )}
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={mutation.isPending}>
            {mutation.isPending ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p className="mt-3 text-center" style={{ color: 'var(--text-secondary)' }}>
          Don't have an account? <Link to="/register">Sign up</Link>
        </p>
      </div>
    </div>
  );
}

