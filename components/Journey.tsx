export default function Journey() {
  const steps = [
    {
      step: '1',
      title: 'Reach out',
      desc: 'Call or message us. A caring team member listens and answers your questions, with no pressure.',
      delay: '0s'
    },
    {
      step: '2',
      title: 'Assessment',
      desc: 'A confidential evaluation helps us understand your history, needs, and goals.',
      delay: '.1s'
    },
    {
      step: '3',
      title: 'Treatment',
      desc: 'Begin a personalized plan combining medical care, therapy, and wellness.',
      delay: '.2s'
    },
    {
      step: '4',
      title: 'Ongoing support',
      desc: 'Transition home with an aftercare plan and a community that stands beside you.',
      delay: '.3s'
    }
  ];

  return (
    <section id="journey">
      <div className="container">
        <div className="section-head reveal">
          <span className="eyebrow">Your Journey</span>
          <h2>A clear path, one step at a time</h2>
          <p>Knowing what to expect makes starting easier. Here is how recovery works at Verdant Path.</p>
        </div>
        <div className="steps">
          {steps.map((s, idx) => (
            <div key={idx} className="step reveal" style={{ ['--d' as any]: s.delay }}>
              <div className="badge">{s.step}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
