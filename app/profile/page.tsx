'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { updateProfileAction } from '@/app/actions/auth';

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading: authLoading, logout } = useAuth();

  // Profile form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [updating, setUpdating] = useState(false);
  const [updateMsg, setUpdateMsg] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      setName(user.name || '');
    }
  }, [user, authLoading, router]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setUpdating(true);
    setUpdateMsg('');

    const res = await updateProfileAction(user._id, { name, phone, address });
    setUpdating(false);
    if (res.success) {
      setUpdateMsg('Profile updated successfully.');
    } else {
      setUpdateMsg(res.error || 'Failed to update profile.');
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  if (authLoading || !user) {
    return (
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center', color: 'var(--muted)' }}>
        Loading your account...
      </div>
    );
  }

  return (
    <div style={{ padding: '4rem 0 7rem' }}>
      <div className="container">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '3rem' }}>
          <div>
            <span className="eyebrow">Patient Profile</span>
            <h2>Welcome back, {user.name}</h2>
            <p style={{ color: 'var(--muted)', fontSize: '.95rem' }}>Account Type: <strong style={{ textTransform: 'capitalize' }}>{user.role}</strong></p>
          </div>
          <div style={{ display: 'flex', gap: '.8rem' }}>
            {user.role === 'admin' && (
              <Link href="/dashboard" className="btn btn-primary btn-sm">
                Open Admin Dashboard →
              </Link>
            )}
            <button type="button" className="btn btn-ghost btn-sm" onClick={handleLogout}>
              Sign Out
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gap: 'clamp(2rem, 5vw, 3rem)', maxWidth: '640px' }}>
          {/* Profile Details Form */}
          <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', padding: '2rem', boxShadow: 'var(--shadow)' }}>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '1.5rem' }}>Personal Information</h3>

            <form onSubmit={handleUpdate} style={{ display: 'grid', gap: '1.2rem', padding: 0, border: 'none', background: 'none', boxShadow: 'none' }}>
              <div className="field">
                <label>Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="field">
                <label>Email Address</label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  style={{ opacity: 0.7, cursor: 'not-allowed' }}
                />
              </div>

              <div className="field">
                <label>Contact Phone</label>
                <input
                  type="tel"
                  placeholder="+1 (800) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="field">
                <label>Residential Address</label>
                <input
                  type="text"
                  placeholder="Street Address, City"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              {updateMsg && (
                <div style={{ fontSize: '.88rem', color: updateMsg.includes('success') ? 'var(--primary)' : '#d9534f' }}>
                  {updateMsg}
                </div>
              )}

              <button className="btn btn-primary" type="submit" disabled={updating}>
                {updating ? 'Saving Changes...' : 'Save Profile Changes'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
