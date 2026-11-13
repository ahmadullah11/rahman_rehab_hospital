'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      router.push('/profile');
    } else {
      setError(res.error || 'Failed to log in. Please check credentials.');
    }
  };

  return (
    <div style={{ padding: '5rem 0 7rem' }}>
      <div className="container" style={{ maxWidth: '480px', margin: '0 auto' }}>
        <div className="section-head center" style={{ marginBottom: '2rem' }}>
          <span className="eyebrow">Patient &amp; Staff Access</span>
          <h2>Sign In to Your Account</h2>
          <p>Access your treatment history, appointments, and medical packages.</p>
        </div>

        <form className="verdant-form" style={{ gridTemplateColumns: '1fr' }} onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <div style={{ color: '#d9534f', fontSize: '.88rem' }}>
              {error}
            </div>
          )}

          <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%' }}>
            {loading ? 'Authenticating...' : 'Sign In'}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>

          <p style={{ textAlign: 'center', fontSize: '.9rem', color: 'var(--muted)', marginTop: '1rem' }}>
            Don’t have an account yet?{' '}
            <Link href="/signup" style={{ color: 'var(--primary)', fontWeight: 600 }}>
              Create Account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
