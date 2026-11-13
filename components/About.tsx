export default function About() {
  return (
    <section id="about">
      <div className="container about-grid">
        <div className="reveal">
          <span className="eyebrow">About Us</span>
          <h2>Care that treats the person, not just the condition.</h2>
          <p>
            Rahman Rehab was founded on a simple belief: lasting recovery grows in an environment of safety, dignity, and trust. Every program is designed around the individual, never a one-size-fits-all plan.
          </p>
          <p>
            Set within calm, private grounds, our center combines clinical excellence with a warm, human approach, so you can focus on what matters most: getting well.
          </p>
        </div>
        <div className="values">
          <div className="value reveal" style={{ ['--d' as any]: '.05s' }}>
            <span className="num">01</span>
            <div>
              <h3>Evidence-based treatment</h3>
              <p>Proven clinical methods guided by licensed medical and psychological professionals.</p>
            </div>
          </div>
          <div className="value reveal" style={{ ['--d' as any]: '.15s' }}>
            <span className="num">02</span>
            <div>
              <h3>Dignity and respect</h3>
              <p>A judgment-free environment where every person is heard and valued.</p>
            </div>
          </div>
          <div className="value reveal" style={{ ['--d' as any]: '.25s' }}>
            <span className="num">03</span>
            <div>
              <h3>Support beyond discharge</h3>
              <p>Recovery continues after treatment, with ongoing community and care.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
