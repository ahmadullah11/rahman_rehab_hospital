export default function Team() {
  const members = [
    {
      initials: 'SA',
      name: 'Dr. Sarah Ahmed',
      role: 'Medical Director',
      bio: 'Board-certified in addiction medicine with 15 years of clinical experience.',
      delay: '0s'
    },
    {
      initials: 'JM',
      name: 'Dr. James Mitchell',
      role: 'Lead Psychologist',
      bio: 'Specializes in trauma-informed care and co-occurring mental health conditions.',
      delay: '.1s'
    },
    {
      initials: 'EL',
      name: 'Elena Lopez, LCSW',
      role: 'Family Program Lead',
      bio: 'Helps families heal together through education, communication, and support.',
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
              <div className="avatar">{m.initials}</div>
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
