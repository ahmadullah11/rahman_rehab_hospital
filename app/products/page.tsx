'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ProductItem } from '@/lib/constants';
import { getProductsAction } from '@/app/actions/products';

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<string>('All');
  const [search, setSearch] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('recommended');

  useEffect(() => {
    async function load() {
      try {
        const res = await getProductsAction();
        if (res.success && res.products) {
          setProducts(res.products);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const categories = ['All', 'Inpatient', 'Psychiatry', 'Outpatient', 'Supplements'];

  const filtered = products
    .filter((p) => {
      if (category !== 'All' && p.category.toLowerCase() !== category.toLowerCase()) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      return 0;
    });

  return (
    <div style={{ paddingTop: '2.5rem', paddingBottom: '5rem' }}>
      <div className="container">
        {/* Header */}
        <div className="section-head center">
          <span className="eyebrow">Clinical Store</span>
          <h2>Treatment Programs &amp; Wellness Products</h2>
          <p>
            Choose an inpatient package, schedule specialized psychiatric diagnostics, or order physician-approved recovery supplements.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            padding: '1.25rem',
            marginBottom: '2.5rem',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: 'var(--shadow)'
          }}
        >
          {/* Categories */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.5rem' }}>
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                className={`btn btn-sm ${category === c ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Search & Sort */}
          <div style={{ display: 'flex', gap: '.75rem', flexWrap: 'wrap', flex: '1 1 220px', justifyContent: 'flex-end', minWidth: 0 }}>
            <input
              type="text"
              placeholder="Search treatments..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ maxWidth: '240px', flex: '1 1 160px', padding: '.55rem .85rem', fontSize: '1rem' }}
            />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort products"
              style={{ maxWidth: '260px', flex: '1 1 200px', padding: '.55rem .85rem', fontSize: '1rem' }}
            >
              <option value="recommended">Sort by: Recommended</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--muted)' }}>
            Loading treatment options...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--muted)' }}>
            No programs or packages matched your search criteria.
          </div>
        ) : (
          <div className="cards">
            {filtered.map((item) => (
              <div key={item._id} className="product-card">
                <div className="product-img-wrap">
                  <img src={item.imageUrl} alt={item.title} />
                  <span className="badge-pill">{item.category}</span>
                </div>
                <div className="product-body">
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '.5rem' }}>{item.title}</h3>
                  <p style={{ color: 'var(--muted)', fontSize: '.92rem', marginBottom: '1.2rem', flex: 1 }}>
                    {item.description}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginTop: 'auto' }}>
                    <div className="product-price">${item.price}</div>
                    <div style={{ display: 'flex', gap: '.5rem' }}>
                      <Link href={`/products/${item._id}`} className="btn btn-ghost btn-sm">
                        Details
                      </Link>
                      <Link href="/#contact" className="btn btn-primary btn-sm">
                        Get Help
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
