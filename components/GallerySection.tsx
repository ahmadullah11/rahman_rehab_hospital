'use client';

import { useState, useEffect, useRef } from 'react';
import { DEFAULT_GALLERY_IMAGES, GalleryItem } from '@/lib/constants';
import UploadModal from '@/components/UploadModal';

export default function GallerySection() {
  const [items, setItems] = useState<GalleryItem[]>(DEFAULT_GALLERY_IMAGES);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  useEffect(() => {
    // Fetch dynamic gallery items if any from API
    fetch('/api/gallery')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.items?.length > 0) {
          setItems(data.items);
        }
      })
      .catch(() => {
        // Fallback to default gallery images
      });
  }, []);

  const categories = ['All', 'Detox', 'Psychiatry', 'Therapy', 'Rooms', 'Environment'];

  const filteredItems = activeCategory === 'All'
    ? items
    : items.filter((img) => img.category.toLowerCase() === activeCategory.toLowerCase());

  // Auto-scroll effect
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      if (sliderRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          sliderRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          sliderRef.current.scrollBy({ left: 340, behavior: 'smooth' });
        }
      }
    }, 3500);

    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <section id="facility" className="alt">
      <div className="container">
        <div className="section-head center reveal">
          <span className="eyebrow">Restorative Spaces</span>
          <h2>A Sanctuary for Healing &amp; Mental Wellness</h2>
          <p>
            Designed specifically for calm, dignity, and confidential clinical addiction recovery. Explore our campus and therapy suites.
          </p>
        </div>

        {/* Categories & Upload Trigger */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.6rem', justifyContent: 'center', marginBottom: '2.5rem' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`btn btn-sm ${activeCategory === cat ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
          <button
            type="button"
            className="btn btn-sm btn-ghost"
            style={{ borderColor: 'var(--primary)', color: 'var(--primary)' }}
            onClick={() => setIsUploadOpen(true)}
          >
            + Add Facility Photo
          </button>
        </div>

        {/* Gallery Slider */}
        <div
          className="gallery-slider"
          ref={sliderRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {filteredItems.map((item) => (
            <div
              key={item._id}
              className="gallery-slide"
              style={{ cursor: 'pointer' }}
              onClick={() => setSelectedImage(item)}
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(15,35,25,.8) 0%, transparent 60%)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  padding: '1.2rem',
                  color: '#fff'
                }}
              >
                <span
                  style={{
                    fontSize: '.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '.08em',
                    opacity: 0.85
                  }}
                >
                  {item.category}
                </span>
                <strong style={{ fontSize: '1.05rem', fontFamily: 'var(--serif)' }}>{item.title}</strong>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {selectedImage && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 300,
              background: 'rgba(10,20,15,.88)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.5rem'
            }}
            onClick={() => setSelectedImage(null)}
          >
            <div
              style={{
                background: 'var(--surface)',
                borderRadius: 'var(--radius)',
                maxWidth: '750px',
                width: '100%',
                overflow: 'hidden',
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow-lg)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ position: 'relative', width: '100%', aspectRatio: '16/10' }}>
                <img
                  src={selectedImage.imageUrl}
                  alt={selectedImage.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span className="eyebrow" style={{ marginBottom: '.25rem' }}>{selectedImage.category}</span>
                    <h3 style={{ fontSize: '1.4rem' }}>{selectedImage.title}</h3>
                  </div>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => setSelectedImage(null)}
                  >
                    Close ✕
                  </button>
                </div>
                {selectedImage.description && (
                  <p style={{ color: 'var(--muted)', marginTop: '.75rem' }}>{selectedImage.description}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ImageKit Upload Modal */}
        {isUploadOpen && (
          <UploadModal
            onClose={() => setIsUploadOpen(false)}
            onUploaded={(newItem) => {
              setItems([newItem, ...items]);
              setIsUploadOpen(false);
            }}
          />
        )}
      </div>
    </section>
  );
}
