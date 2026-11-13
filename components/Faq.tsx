'use client';

import { useState } from 'react';

export default function Faq() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How quickly can I be admitted?',
      a: 'In most cases we can complete an assessment the same day and admit within 24 hours, depending on availability and medical needs.'
    },
    {
      q: 'Is my information kept confidential?',
      a: 'Yes. We follow strict privacy standards. Your information is never shared without your written consent, except where required by law.'
    },
    {
      q: 'Do you accept insurance?',
      a: 'We work with most major insurance providers. Our admissions team will verify your benefits for free and explain all options clearly.'
    },
    {
      q: 'How long does treatment last?',
      a: 'Programs typically range from 30 to 90 days, followed by aftercare. Your plan is tailored to your progress and needs.'
    },
    {
      q: 'Can my family visit me?',
      a: 'Yes. Scheduled family visits and counseling sessions are part of our programs, because healing is stronger with loved ones involved.'
    }
  ];

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section id="faq" className="alt">
      <div className="container faq-wrap">
        <div className="section-head reveal">
          <span className="eyebrow">FAQ</span>
          <h2>Common questions, answered honestly</h2>
          <p>Can’t find what you’re looking for? Our team is always happy to talk.</p>
        </div>
        <div className="reveal" style={{ ['--d' as any]: '.1s' }}>
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div key={idx} className={`faq-item ${isOpen ? 'open' : ''}`}>
                <button
                  type="button"
                  className="faq-q"
                  aria-expanded={isOpen}
                  onClick={() => toggle(idx)}
                >
                  {faq.q}
                  <span className="plus" />
                </button>
                <div className="faq-a">
                  <div>
                    <p>{faq.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
