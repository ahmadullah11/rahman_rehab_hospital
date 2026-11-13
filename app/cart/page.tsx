'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, subtotal, clearCart } = useCart();
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoMessage, setPromoMessage] = useState('');

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'RECOVERY10') {
      setDiscountPercent(10);
      setPromoMessage('10% Recovery Assistance discount applied!');
    } else {
      setDiscountPercent(0);
      setPromoMessage('Invalid voucher code. Try RECOVERY10');
    }
  };

  const discountAmount = (subtotal * discountPercent) / 100;
  const finalTotal = Math.max(0, subtotal - discountAmount);

  return (
    <div style={{ padding: '4rem 0 6rem' }}>
      <div className="container">
        <div className="section-head center">
          <span className="eyebrow">Your Selection</span>
          <h2>Clinical Enrollment &amp; Cart</h2>
          <p>Review your selected programs, supplements, and services before proceeding to admission.</p>
        </div>

        {cart.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '4rem 1.5rem',
              background: 'var(--surface)',
              borderRadius: 'var(--radius)',
              border: '1px solid var(--border)',
              maxWidth: '600px',
              margin: '0 auto'
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="48" height="48" style={{ margin: '0 auto 1.5rem', color: 'var(--muted)' }}>
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            <h3>Your cart is currently empty</h3>
            <p style={{ color: 'var(--muted)', margin: '1rem 0 2rem' }}>
              Explore our rehabilitation packages and wellness resources to get started.
            </p>
            <Link href="/products" className="btn btn-primary">
              Explore Programs &amp; Store
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'start' }}>
            {/* Cart Items List */}
            <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', padding: '1.5rem', boxShadow: 'var(--shadow)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
                <h3 style={{ fontSize: '1.25rem' }}>Items in Care Plan ({cart.length})</h3>
                <button
                  type="button"
                  onClick={clearCart}
                  style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: '.88rem' }}
                >
                  Clear All
                </button>
              </div>

              <div style={{ display: 'grid', gap: '1.5rem' }}>
                {cart.map((item: any) => (
                  <div
                    key={item.product._id}
                    style={{
                      display: 'flex',
                      gap: '1.2rem',
                      alignItems: 'center',
                      paddingBottom: '1.2rem',
                      borderBottom: '1px solid var(--border)'
                    }}
                  >
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.title}
                      style={{ width: '84px', height: '84px', objectFit: 'cover', borderRadius: '12px', border: '1px solid var(--border)', flexShrink: 0 }}
                    />
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: '.75rem', color: 'var(--primary)', fontWeight: 600, textTransform: 'uppercase' }}>
                        {item.product.category}
                      </span>
                      <h4 style={{ fontSize: '1.05rem', margin: '.2rem 0 .4rem' }}>{item.product.title}</h4>
                      <div style={{ fontWeight: 600, color: 'var(--primary)' }}>${item.product.price}</div>
                    </div>

                    {/* Quantity controls */}
                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border)', borderRadius: '8px', background: 'var(--bg)' }}>
                      <button
                        type="button"
                        style={{ border: 'none', background: 'none', padding: '.3rem .6rem', cursor: 'pointer' }}
                        onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                      >
                        -
                      </button>
                      <span style={{ padding: '0 .5rem', fontSize: '.9rem', fontWeight: 600 }}>{item.quantity}</span>
                      <button
                        type="button"
                        style={{ border: 'none', background: 'none', padding: '.3rem .6rem', cursor: 'pointer' }}
                        onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>

                    {/* Remove */}
                    <button
                      type="button"
                      aria-label="Remove item"
                      onClick={() => removeFromCart(item.product._id)}
                      style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', padding: '.4rem' }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', padding: '2rem', boxShadow: 'var(--shadow)' }}>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '1.5rem' }}>Order Summary</h3>

              {/* Promo input */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ fontSize: '.85rem', fontWeight: 500, display: 'block', marginBottom: '.4rem' }}>
                  Have an assistance voucher?
                </label>
                <div style={{ display: 'flex', gap: '.5rem' }}>
                  <input
                    type="text"
                    placeholder="e.g. RECOVERY10"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    style={{ flex: 1, padding: '.65rem .85rem' }}
                  />
                  <button type="button" className="btn btn-ghost btn-sm" onClick={handleApplyPromo}>
                    Apply
                  </button>
                </div>
                {promoMessage && (
                  <p style={{ fontSize: '.8rem', color: discountPercent > 0 ? 'var(--primary)' : '#d9534f', marginTop: '.4rem' }}>
                    {promoMessage}
                  </p>
                )}
              </div>

              {/* Breakdown */}
              <div style={{ display: 'grid', gap: '.8rem', borderTop: '1px solid var(--border)', paddingTop: '1.2rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--muted)' }}>
                  <span>Subtotal</span>
                  <span>${subtotal.toLocaleString()}</span>
                </div>
                {discountPercent > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--primary)' }}>
                    <span>Voucher ({discountPercent}%)</span>
                    <span>-${discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--muted)' }}>
                  <span>Admissions &amp; Intake Fee</span>
                  <span>$0.00 (Waived)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.3rem', fontWeight: 600, borderTop: '1px solid var(--border)', paddingTop: '1rem', color: 'var(--text)' }}>
                  <span>Total Due</span>
                  <span style={{ color: 'var(--primary)' }}>${finalTotal.toLocaleString()}</span>
                </div>
              </div>

              <Link href="/checkout" className="btn btn-primary" style={{ width: '100%', textAlign: 'center' }}>
                Proceed to Confidential Checkout →
              </Link>

              <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '.82rem', color: 'var(--muted)' }}>
                🔒 256-Bit Encrypted &amp; HIPAA Compliant Transaction
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
