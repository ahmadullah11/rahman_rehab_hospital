import TeamPortrait from '@/components/TeamPortrait';

export default function Team() {
  const members = [
    {
      initials: 'AR',
      name: 'Anayat Ur Rahman',
      role: 'Managing Director',
      bio: 'Leads the hospital’s mission, admissions and patient-care standards across both branches.',
      image:
        'https://images.pexels.com/photos/7580937/pexels-photo-7580937.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
      alt: 'Portrait of Anayat Ur Rahman, Managing Director',
      delay: '0s'
    },
    {
      initials: 'AH',
      name: 'Dr. Asif Hussain',
      role: 'Consultant Psychiatrist',
      bio: 'Psychiatric assessment, medication management and dual-diagnosis care for adults.',
      image:
        'https://images.pexels.com/photos/19438563/pexels-photo-19438563.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
      alt: 'Portrait of Dr. Asif Hussain, Consultant Psychiatrist',
      delay: '.1s'
    },
    {
      initials: 'TH',
      name: 'Ms. Tania Hameed',
      role: 'Clinical Psychologist',
      bio: 'Cognitive behavioural therapy, relapse prevention and family counselling.',
      image:
        'https://images.pexels.com/photos/5738735/pexels-photo-5738735.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
      alt: 'Portrait of Ms. Tania Hameed, Clinical Psychologist',
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
              <TeamPortrait src={m.image} alt={m.alt} initials={m.initials} />
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
