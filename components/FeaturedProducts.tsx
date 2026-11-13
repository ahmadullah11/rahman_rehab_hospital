'use client';

import { useState } from 'react';
import Link from 'next/link';
import { INITIAL_PRODUCTS, ProductItem } from '@/lib/constants';
import { useCart } from '@/context/CartContext';

export default function FeaturedProducts() {
  const { addToCart } = useCart();
  const [addedId, setAddedId] = useState<string | null>(null);

  const handleAdd = (p: ProductItem) => {
    addToCart(p, 1);
    setAddedId(p._id);
    setTimeout(() => setAddedId(null), 1500);
  };

  return (
    <section id="store-preview">
      <div className="container">
        <div className="section-head center reveal">
          <span className="eyebrow">Treatment Packages</span>
          <h2>Care packages with clear, upfront pricing</h2>
          <p>Every plan includes a clinical assessment, a personalised treatment plan, and direct admission support.</p>
        </div>

        <div className="cards">
          {INITIAL_PRODUCTS.map((prod) => (
            <div key={prod._id} className="product-card reveal">
              <div className="product-img-wrap">
                <img src={prod.imageUrl} alt={prod.title} />
                <span className="badge-pill">{prod.category}</span>
              </div>
              <div className="product-body">
                <h3 style={{ fontSize: '1.25rem', marginBottom: '.5rem' }}>{prod.title}</h3>
                <p style={{ color: 'var(--muted)', fontSize: '.92rem', marginBottom: '1.2rem', flex: 1 }}>
                  {prod.description}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginTop: 'auto' }}>
                  <div className="product-price">${prod.price}</div>
                  <div style={{ display: 'flex', gap: '.5rem' }}>
                    <Link href={`/products/${prod._id}`} className="btn btn-ghost btn-sm">
                      Details
                    </Link>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => handleAdd(prod)}
                    >
                      {addedId === prod._id ? 'Added ✓' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <Link href="/products" className="btn btn-ghost">
            View All Clinical Packages &amp; Supplements →
          </Link>
        </div>
      </div>
    </section>
  );
}
