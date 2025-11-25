import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { register } from '../services/api';
import { useAuth } from '../hooks/useAuth';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const auth = useAuth();

  const mutation = useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      auth.login(data.user, data.token);
      navigate('/');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({ name, email, password });
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Create Account</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Name</label>
            <input
              type="text"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
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
              minLength={6}
            />
          </div>
          {mutation.error && (
            <div className="error-message">
              {mutation.error.response?.data?.error || 'Registration failed'}
            </div>
          )}
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={mutation.isPending}>
            {mutation.isPending ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>
        <p className="mt-3 text-center" style={{ color: 'var(--text-secondary)' }}>
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

