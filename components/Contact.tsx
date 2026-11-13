'use client';

import { useState } from 'react';
import { BRANCHES, CONTACT, mapsUrl, toTel } from '@/lib/site';
import SocialLinks from '@/components/SocialLinks';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    topic: 'Treatment for myself',
    msg: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess(false);

    try {
      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setFormData({
          name: '',
          phone: '',
          email: '',
          topic: 'Treatment for myself',
          msg: ''
        });
      } else {
        setError(data.error || 'Failed to submit enquiry.');
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact">
      <div className="container">
        <div className="contact-grid">
          <div className="contact-info reveal">
            <div>
              <h2>You don’t have to do this alone.</h2>
              <p style={{ marginTop: '.8rem' }}>Reach out today. Every conversation is private and without obligation.</p>
            </div>

            <div className="info-row">
              <div className="ic">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" />
                </svg>
              </div>
              <div>
                <small>Call anytime</small>
                <span className="info-links">
                  {CONTACT.phones.map((phone) => (
                    <a key={phone} href={`tel:${toTel(phone)}`}>{phone}</a>
                  ))}
                </span>
              </div>
            </div>

            <div className="info-row">
              <div className="ic">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="M22 7l-10 6L2 7" />
                </svg>
              </div>
              <div>
                <small>Email</small>
                <span className="info-links">
                  <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
                </span>
              </div>
            </div>

            <div className="info-row">
              <div className="ic">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <div>
                <small>Our branches</small>
                {BRANCHES.map((branch) => (
                  <span key={branch.id} className="info-branch">
                    <a
                      href={mapsUrl(branch.mapQuery)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="info-branch-label"
                    >
                      {branch.city}{branch.primary ? ' · Main' : ''}
                    </a>
                    <span>{branch.address}</span>
                  </span>
                ))}
              </div>
            </div>

            <div className="info-row">
              <div className="ic">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5l3 2" />
                </svg>
              </div>
              <div>
                <small>Hours</small>
                <span className="info-hours">
                  <span className="dot-live" aria-hidden="true" />
                  {CONTACT.hours}
                  <span className="info-hours-note">· {CONTACT.hoursDetail}</span>
                </span>
              </div>
            </div>

            <div className="info-social">
              <span>Follow our updates</span>
              <SocialLinks onDark />
            </div>

            <p className="notice">If you or someone you know is in immediate danger, please call your local emergency number right away.</p>
          </div>

          <form className="verdant-form reveal" style={{ ['--d' as any]: '.1s' }} onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="name">Full name</label>
              <input
                id="name"
                type="text"
                placeholder="Your name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="field">
              <label htmlFor="phone">Phone</label>
              <input
                id="phone"
                type="tel"
                placeholder="0300 0000000"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className="field full">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="field full">
              <label htmlFor="topic">I’m looking for</label>
              <select
                id="topic"
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
              >
                <option>Treatment for myself</option>
                <option>Help for a loved one</option>
                <option>Insurance &amp; admissions</option>
                <option>Something else</option>
              </select>
            </div>
            <div className="field full">
              <label htmlFor="msg">Message (optional)</label>
              <textarea
                id="msg"
                placeholder="Share as much or as little as you’d like"
                value={formData.msg}
                onChange={(e) => setFormData({ ...formData, msg: e.target.value })}
              />
            </div>
            <button className="btn btn-primary" type="submit" disabled={submitting}>
              {submitting ? 'Sending...' : 'Send Message'}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>
            <p className="form-note">Your details are private and will only be used to contact you.</p>
            {success && (
              <div className="form-success show" role="status">
                Thank you. A member of our clinical admissions team will contact you shortly.
              </div>
            )}
            {error && (
              <div className="form-note" style={{ color: '#d9534f' }}>
                {error}
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
