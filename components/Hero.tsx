import Link from 'next/link';
import { CONTACT, toTel } from '@/lib/site';

export default function Hero() {
  return (
    <section className="hero" id="home">
      <div className="container hero-grid">
        <div>
          <span className="eyebrow rise" style={{ animationDelay: '.05s' }}>
            Rehabilitation &amp; Psychiatric Care
          </span>
          <h1 className="rise" style={{ animationDelay: '.15s' }}>
            Recovery begins with <em>one</em> quiet step.
          </h1>
          <p className="lead rise" style={{ animationDelay: '.3s' }}>
            A private, compassionate place to heal. Our clinicians and counselors provide evidence-based treatment that supports the whole person, in body, mind, and spirit.
          </p>
          <div className="hero-cta rise" style={{ animationDelay: '.45s' }}>
            <Link href="#contact" className="btn btn-primary">
              Start Your Recovery
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
            <Link href="#programs" className="btn btn-ghost">
              Explore Programs
            </Link>
          </div>
          <div className="helpline rise" style={{ animationDelay: '.6s' }}>
            <div className="dot">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" />
              </svg>
            </div>
            <div>
              24/7 confidential helpline
              <a href={`tel:${toTel(CONTACT.phones[0])}`} className="helpline-number">
                {CONTACT.phones[0]}
              </a>
            </div>
          </div>
        </div>

        <div className="hero-art rise" style={{ animationDelay: '.35s' }} aria-hidden="true">
          <div className="blob"></div>
          <div className="blob b2"></div>
          <svg className="leaf" viewBox="0 0 120 140" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M60 135V60" />
            <path d="M60 80C30 80 10 60 10 28c30 0 50 20 50 52z" fill="currentColor" fillOpacity=".14" />
            <path d="M60 60c0-28 20-52 50-52 0 30-20 52-50 52z" fill="currentColor" fillOpacity=".14" />
            <path d="M60 100c-14 0-26-10-26-24" />
          </svg>
          <div className="float-card fc2">
            <div className="ic">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="M9 12l2 2 4-4" />
              </svg>
            </div>
            <div>
              <strong>100% Confidential</strong>
              Your privacy, protected
            </div>
          </div>
          <div className="float-card fc1">
            <div className="ic">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 2" />
              </svg>
            </div>
            <div>
              <strong>Same-day assessment</strong>
              Admission within 24 hours
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
