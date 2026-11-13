'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { createOrderAction } from '@/app/actions/orders';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, subtotal, clearCart } = useCart();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: 'Peshawar',
    postalCode: '25000',
    paymentMethod: 'cash_on_admission',
    notes: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderComplete, setOrderComplete] = useState<any>(null);

  if (cart.length === 0 && !orderComplete) {
    return (
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center' }}>
        <h2>No Items to Checkout</h2>
        <p style={{ color: 'var(--muted)', margin: '1rem 0 2rem' }}>Please select a program or package before proceeding.</p>
        <Link href="/products" className="btn btn-primary">
          Browse Store
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const orderItems = cart.map((c: any) => ({
        productId: c.product._id,
        title: c.product.title,
        price: c.product.price,
        quantity: c.quantity,
        imageUrl: c.product.imageUrl
      }));

      const res = await createOrderAction({
        items: orderItems,
        totalAmount: subtotal,
        customerDetails: {
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          notes: formData.notes
        },
        paymentMethod: formData.paymentMethod,
        paymentStatus: formData.paymentMethod === 'card' ? 'paid' : 'pending'
      });

      if (res.success && res.order) {
        setOrderComplete(res.order);
        clearCart();
      } else {
        setError(res.error || 'Failed to place order.');
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (orderComplete) {
    return (
      <div style={{ padding: '5rem 0' }}>
        <div className="container" style={{ maxWidth: '640px', margin: '0 auto', textAlign: 'center' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'var(--soft)',
              color: 'var(--primary)',
              display: 'grid',
              placeItems: 'center',
              margin: '0 auto 1.5rem',
              fontSize: '2rem'
            }}
          >
            ✓
          </div>
          <span className="eyebrow">Enrollment Confirmed</span>
          <h2>Thank You for Reaching Out</h2>
          <p style={{ color: 'var(--muted)', margin: '1rem 0 2rem' }}>
            Your care enrollment request has been registered securely. Your reference number is{' '}
            <strong style={{ color: 'var(--text)' }}>#{orderComplete._id?.slice(-8).toUpperCase()}</strong>.
            A medical coordinator will contact you via phone or email within 2-4 hours.
          </p>

          <div
            style={{
              background: 'var(--surface)',
              borderRadius: 'var(--radius)',
              border: '1px solid var(--border)',
              padding: '1.5rem',
              textAlign: 'left',
              marginBottom: '2rem'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '.8rem' }}>
              <span style={{ color: 'var(--muted)' }}>Payment Method:</span>
              <strong>{orderComplete.paymentMethod.replace(/_/g, ' ').toUpperCase()}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '.8rem' }}>
              <span style={{ color: 'var(--muted)' }}>Total Amount:</span>
              <strong style={{ color: 'var(--primary)' }}>${orderComplete.totalAmount.toLocaleString()}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--muted)' }}>Status:</span>
              <span style={{ textTransform: 'capitalize', color: 'var(--primary)', fontWeight: 600 }}>{orderComplete.status}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link href="/" className="btn btn-primary">
              Return Home
            </Link>
            <Link href="/profile" className="btn btn-ghost">
              View Order in Profile
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '4rem 0 6rem' }}>
      <div className="container">
        <div className="section-head center">
          <span className="eyebrow">Confidential Checkout</span>
          <h2>Patient Admission &amp; Billing Details</h2>
          <p>Please enter your information to secure your enrollment or clinical product order.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3.5rem', alignItems: 'start' }}>
          {/* Checkout Form */}
          <form className="verdant-form" onSubmit={handleSubmit}>
            <div className="field full">
              <label htmlFor="fullName">Patient / Primary Contact Full Name</label>
              <input
                id="fullName"
                type="text"
                required
                placeholder="John Doe"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />
            </div>

            <div className="field">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                required
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="field">
              <label htmlFor="phone">Phone / WhatsApp</label>
              <input
                id="phone"
                type="tel"
                required
                placeholder="+1 (800) 000-0000"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div className="field full">
              <label htmlFor="address">Physical Street Address</label>
              <input
                id="address"
                type="text"
                required
                placeholder="123 Serenity Blvd"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>

            <div className="field">
              <label htmlFor="city">City</label>
              <input
                id="city"
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
            </div>

            <div className="field">
              <label htmlFor="postalCode">Postal / Zip Code</label>
              <input
                id="postalCode"
                type="text"
                required
                value={formData.postalCode}
                onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
              />
            </div>

            {/* Payment Method Selection */}
            <div className="field full" style={{ marginTop: '.5rem' }}>
              <label>Select Payment / Settlement Preference</label>
              <div style={{ display: 'grid', gap: '.8rem', marginTop: '.4rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '.8rem', padding: '.9rem 1.2rem', border: '1px solid var(--border)', borderRadius: '12px', background: formData.paymentMethod === 'cash_on_admission' ? 'var(--soft)' : 'var(--bg)', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="payment"
                    value="cash_on_admission"
                    checked={formData.paymentMethod === 'cash_on_admission'}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    style={{ width: 'auto' }}
                  />
                  <div>
                    <strong>Cash on Admission / Facility Visit</strong>
                    <div style={{ fontSize: '.82rem', color: 'var(--muted)' }}>Pay securely in person upon hospital intake or package pickup</div>
                  </div>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '.8rem', padding: '.9rem 1.2rem', border: '1px solid var(--border)', borderRadius: '12px', background: formData.paymentMethod === 'bank_transfer' ? 'var(--soft)' : 'var(--bg)', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="payment"
                    value="bank_transfer"
                    checked={formData.paymentMethod === 'bank_transfer'}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    style={{ width: 'auto' }}
                  />
                  <div>
                    <strong>Direct Bank Wire / Hospital Transfer</strong>
                    <div style={{ fontSize: '.82rem', color: 'var(--muted)' }}>Official banking details will be provided immediately</div>
                  </div>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '.8rem', padding: '.9rem 1.2rem', border: '1px solid var(--border)', borderRadius: '12px', background: formData.paymentMethod === 'card' ? 'var(--soft)' : 'var(--bg)', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={formData.paymentMethod === 'card'}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    style={{ width: 'auto' }}
                  />
                  <div>
                    <strong>Credit / Debit Card (Online Demo)</strong>
                    <div style={{ fontSize: '.82rem', color: 'var(--muted)' }}>Instant simulated payment verification</div>
                  </div>
                </label>
              </div>
            </div>

            <div className="field full">
              <label htmlFor="notes">Clinical Intake Notes or Dietary/Room Needs (Optional)</label>
              <textarea
                id="notes"
                placeholder="Mention any specific medical requirements, urgency, or accommodations..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>

            {error && (
              <div className="field full" style={{ color: '#d9534f', fontSize: '.9rem' }}>
                {error}
              </div>
            )}

            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? 'Processing Order...' : `Complete Order ($${subtotal.toLocaleString()})`}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>
          </form>

          {/* Cart Review Side Box */}
          <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', padding: '2rem', boxShadow: 'var(--shadow)' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.2rem' }}>Selected Packages ({cart.length})</h3>
            <div style={{ display: 'grid', gap: '1rem', marginBottom: '1.5rem', maxHeight: '320px', overflowY: 'auto' }}>
              {cart.map((item: any) => (
                <div key={item.product._id} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.title}
                    style={{ width: '54px', height: '54px', borderRadius: '8px', objectFit: 'cover' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '.92rem', fontWeight: 600 }}>{item.product.title}</div>
                    <div style={{ fontSize: '.82rem', color: 'var(--muted)' }}>Qty: {item.quantity} × ${item.product.price}</div>
                  </div>
                  <div style={{ fontWeight: 600, color: 'var(--primary)' }}>${(item.quantity * item.product.price).toLocaleString()}</div>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.2rem', display: 'grid', gap: '.6rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--muted)' }}>
                <span>Subtotal</span>
                <span>${subtotal.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--muted)' }}>
                <span>Registration Fee</span>
                <span>$0.00 (Waived)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 600, borderTop: '1px solid var(--border)', paddingTop: '.8rem' }}>
                <span>Total</span>
                <span style={{ color: 'var(--primary)' }}>${subtotal.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
