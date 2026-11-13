import Link from 'next/link';
import { BRANCHES, CONTACT, HOSPITAL, toTel } from '@/lib/site';
import SocialLinks from '@/components/SocialLinks';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site">
      <div className="container">
        <div className="foot-grid">
          <div>
            <Link href="/" className="logo">
              <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 29V14" />
                <path d="M16 18c-5 0-9-3.5-9-9 5 0 9 3.5 9 9z" />
                <path d="M16 14c0-5 3.5-9 9-9 0 5-3.5 9-9 9z" />
              </svg>
              {HOSPITAL.name}
            </Link>
            <p>
              Compassionate, evidence-based care for individuals and families on the road to recovery from
              addiction and mental health challenges. Inpatient, outpatient and psychiatric services in
              Peshawar and Swat.
            </p>
            <SocialLinks />
          </div>

          <div>
            <h4>Explore</h4>
            <ul>
              <li><Link href="/#about">About</Link></li>
              <li><Link href="/#programs">Programs</Link></li>
              <li><Link href="/#journey">Journey</Link></li>
              <li><Link href="/#team">Team</Link></li>
              <li><Link href="/#branches">Branches</Link></li>
              <li><Link href="/#facility">Gallery</Link></li>
            </ul>
          </div>

          <div>
            <h4>Support &amp; Portal</h4>
            <ul>
              <li><Link href="/#faq">FAQ</Link></li>
              <li><Link href="/#stories">Stories</Link></li>
              <li><Link href="/#contact">Contact</Link></li>
              <li><Link href="/products">Store &amp; Packages</Link></li>
              <li><Link href="/profile">Patient Account</Link></li>
              <li><Link href="/dashboard">Admin Panel</Link></li>
            </ul>
          </div>

          <div className="foot-contact">
            <h4>Contact</h4>
            <ul>
              {CONTACT.phones.map((phone) => (
                <li key={phone}>
                  <a href={`tel:${toTel(phone)}`}>{phone}</a>
                </li>
              ))}
              <li>
                <a href={`mailto:${CONTACT.email}`} className="foot-email">{CONTACT.email}</a>
              </li>
            </ul>
            <p className="foot-hours">
              <span className="dot-live" aria-hidden="true" />
              {CONTACT.hours}
            </p>
            {BRANCHES.map((branch) => (
              <p key={branch.id} className="foot-branch">
                <span>{branch.primary ? 'Main branch' : 'Branch'} · {branch.city}</span>
                {branch.address}
              </p>
            ))}
          </div>
        </div>

        <div className="foot-bottom">
          <span>© {currentYear} {HOSPITAL.fullName}. All rights reserved.</span>
          <span>Privacy Policy · Terms · Medical Disclaimer</span>
        </div>
      </div>
    </footer>
  );
}
