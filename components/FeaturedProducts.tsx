import Link from 'next/link';
import { INITIAL_PRODUCTS } from '@/lib/constants';

export default function FeaturedProducts() {
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
                    <Link href="/#contact" className="btn btn-primary btn-sm">
                      Get Help
                    </Link>
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
