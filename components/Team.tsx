export default function Team() {
  const members = [
    {
      initials: 'AR',
      name: 'Anayat Ur Rahman',
      role: 'Managing Director',
      bio: 'Leads the hospital’s mission, admissions and patient-care standards across both branches.',
      delay: '0s'
    },
    {
      initials: 'AH',
      name: 'Dr. Asif Hussain',
      role: 'Consultant Psychiatrist',
      bio: 'Psychiatric assessment, medication management and dual-diagnosis care for adults.',
      delay: '.1s'
    },
    {
      initials: 'TH',
      name: 'Ms. Tania Hameed',
      role: 'Clinical Psychologist',
      bio: 'Cognitive behavioural therapy, relapse prevention and family counselling.',
      delay: '.2s'
    }
  ];

  return (
    <section id="team" className="alt">
      <div className="container">
        <div className="section-head center reveal">
          <span className="eyebrow">Our Team</span>
          <h2>Guided by experienced, caring professionals</h2>
          <p>Licensed specialists who bring both clinical expertise and genuine compassion.</p>
        </div>
        <div className="team">
          {members.map((m, idx) => (
            <div key={idx} className="member reveal" style={{ ['--d' as any]: m.delay }}>
              <div className="avatar" aria-hidden="true">{m.initials}</div>
              <h3>{m.name}</h3>
              <div className="role">{m.role}</div>
              <p>{m.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
