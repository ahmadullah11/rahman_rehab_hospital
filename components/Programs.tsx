export default function Programs() {
  const programs = [
    {
      title: 'Medical Detox',
      desc: 'Safe, medically supervised withdrawal with round-the-clock monitoring and comfort care.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z" />
        </svg>
      ),
      delay: '0s'
    },
    {
      title: 'Individual & Group Therapy',
      desc: 'CBT, DBT, and motivational therapy to uncover root causes and build lasting coping skills.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" />
        </svg>
      ),
      delay: '.08s'
    },
    {
      title: 'Dual Diagnosis',
      desc: 'Integrated treatment for addiction alongside anxiety, depression, trauma, and other conditions.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z" />
        </svg>
      ),
      delay: '.16s'
    },
    {
      title: 'Family Programs',
      desc: 'Education, counseling, and healing sessions to rebuild trust and strengthen your support system.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8" />
        </svg>
      ),
      delay: '0s'
    },
    {
      title: 'Holistic Wellness',
      desc: 'Mindfulness, yoga, nutrition, and fitness that restore balance and build healthy routines.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 19 2c1 2 2 4.5 2 8 0 5.5-4.8 10-10 10z" />
          <path d="M2 21c0-3 1.9-5.5 6-7" />
        </svg>
      ),
      delay: '.08s'
    },
    {
      title: 'Aftercare & Alumni',
      desc: 'Relapse prevention planning, check-ins, and a welcoming alumni community for the long run.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
      delay: '.16s'
    }
  ];

  return (
    <section id="programs" className="alt">
      <div className="container">
        <div className="section-head center reveal">
          <span className="eyebrow">Our Programs</span>
          <h2>Comprehensive support at every stage</h2>
          <p>From the first day of detox to long-term aftercare, our programs adapt to your needs.</p>
        </div>
        <div className="cards">
          {programs.map((p, idx) => (
            <article key={idx} className="card reveal" style={{ ['--d' as any]: p.delay }}>
              <div className="ic">{p.icon}</div>
              <h3>{p.title}</h3>
              <p>{p.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
