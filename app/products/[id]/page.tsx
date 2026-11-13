'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ProductItem } from '@/lib/constants';
import { getProductByIdAction } from '@/app/actions/products';

export default function ProductDetailPage() {
  const params = useParams();
  const [product, setProduct] = useState<ProductItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!params?.id) return;
      try {
        const res = await getProductByIdAction(params.id as string);
        if (res.success && res.product) {
          setProduct(res.product);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [params?.id]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center', color: 'var(--muted)' }}>
        Loading program details...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center' }}>
        <h2>Product or Program Not Found</h2>
        <p style={{ color: 'var(--muted)', margin: '1rem 0 2rem' }}>The requested item does not exist or has been removed.</p>
        <Link href="/products" className="btn btn-primary">
          Back to Catalog
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '4rem 0 6rem' }}>
      <div className="container">
        {/* Breadcrumb */}
        <div style={{ marginBottom: '2rem', fontSize: '.9rem', color: 'var(--muted)' }}>
          <Link href="/">Home</Link> &gt; <Link href="/products">Store</Link> &gt; <span style={{ color: 'var(--text)' }}>{product.title}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3.5rem', alignItems: 'start' }}>
          {/* Image */}
          <div
            style={{
              borderRadius: 'var(--radius)',
              overflow: 'hidden',
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow)',
              background: 'var(--surface)'
            }}
          >
            <img
              src={product.imageUrl}
              alt={product.title}
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </div>

          {/* Details */}
          <div>
            <span className="badge-pill" style={{ position: 'static', display: 'inline-block', marginBottom: '1rem' }}>
              {product.category}
            </span>
            <h1 style={{ fontSize: '2.4rem', marginBottom: '1rem' }}>{product.title}</h1>
            <div className="product-price" style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>
              ${product.price}
            </div>

            <p style={{ color: 'var(--muted)', fontSize: '1.05rem', lineHeight: 1.8, marginBottom: '2rem' }}>
              {product.description}
            </p>

            {/* Features Included */}
            {product.features && product.features.length > 0 && (
              <div style={{ marginBottom: '2.5rem' }}>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '.8rem' }}>Program Inclusions:</h4>
                <ul style={{ display: 'grid', gap: '.6rem' }}>
                  {product.features.map((feat: string, idx: number) => (
                    <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '.6rem', color: 'var(--text)' }}>
                      <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>✓</span> {feat}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link href="/#contact" className="btn btn-primary">
                Book a Consultation
              </Link>
              <Link href="/products" className="btn btn-ghost">
                View All Programs
              </Link>
            </div>

            {/* Security Guarantee */}
            <div
              style={{
                marginTop: '2.5rem',
                padding: '1.25rem',
                borderRadius: '12px',
                background: 'var(--soft)',
                display: 'flex',
                gap: '1rem',
                alignItems: 'center'
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="28" height="28" style={{ color: 'var(--primary)', flexShrink: 0 }}>
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="M9 12l2 2 4-4" />
              </svg>
              <div style={{ fontSize: '.88rem', color: 'var(--text)' }}>
                <strong>100% Confidential &amp; Medically Certified</strong>
                <p style={{ margin: 0, opacity: .8 }}>All treatments are coordinated through licensed physicians and psychiatrists.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
