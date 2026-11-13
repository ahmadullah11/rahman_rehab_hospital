import { BRANCHES, HOSPITAL, mapsUrl, toTel } from '@/lib/site';
import SocialLinks from '@/components/SocialLinks';

const PinIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" />
  </svg>
);

const ClockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);

const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 17L17 7M9 7h8v8" />
  </svg>
);

export default function Branches() {
  return (
    <section id="branches">
      <div className="container">
        <div className="section-head center reveal">
          <span className="eyebrow">Our Branches</span>
          <h2>Two calm places to begin again</h2>
          <p>
            Both of our facilities in Khyber Pakhtunkhwa admit patients around the clock, with the same
            clinical team, the same standards, and the same privacy.
          </p>
        </div>

        <div className="branch-grid">
          {BRANCHES.map((branch, index) => (
            <article
              key={branch.id}
              className={`branch-card reveal${branch.primary ? ' is-primary' : ''}`}
              style={{ ['--d' as any]: `${index * 0.12}s` }}
            >
              <div className="branch-glow" aria-hidden="true" />

              <header className="branch-head">
                <div className="branch-pin">
                  <PinIcon />
                </div>
                <div>
                  <span className="branch-tag">{branch.label}</span>
                  <h3>{branch.city}</h3>
                  <p className="branch-org">{HOSPITAL.fullName}</p>
                </div>
              </header>

              <div className="branch-rows">
                <div className="branch-row">
                  <div className="ic">
                    <PinIcon />
                  </div>
                  <div>
                    <small>Address</small>
                    <p>{branch.address}</p>
                  </div>
                </div>

                <div className="branch-row">
                  <div className="ic">
                    <PhoneIcon />
                  </div>
                  <div>
                    <small>Phone</small>
                    <p className="branch-phones">
                      {branch.phones.map((phone) => (
                        <a key={phone} href={`tel:${toTel(phone)}`}>
                          {phone}
                        </a>
                      ))}
                    </p>
                  </div>
                </div>

                <div className="branch-row">
                  <div className="ic">
                    <ClockIcon />
                  </div>
                  <div>
                    <small>Opening hours</small>
                    <p className="branch-hours">
                      <span className="dot-live" aria-hidden="true" />
                      {branch.hours}
                      <span className="branch-hours-note">· 24/7 admissions</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="branch-actions">
                <a href={`tel:${toTel(branch.phones[0])}`} className="btn btn-primary btn-sm">
                  Call this branch
                </a>
                <a
                  href={mapsUrl(branch.mapQuery)}
                  className="btn btn-ghost btn-sm"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Get directions
                  <ArrowIcon />
                </a>
              </div>
            </article>
          ))}
        </div>

        <div className="branch-foot reveal">
          <p>
            Not sure which branch is right for you? Call{" "}
            <a href={`tel:${toTel(BRANCHES[0].phones[0])}`}>{BRANCHES[0].phones[0]}</a> and our admissions
            team will guide you.
          </p>
          <div className="branch-foot-social">
            <span>Follow us</span>
            <SocialLinks />
          </div>
        </div>
      </div>
    </section>
  );
}
