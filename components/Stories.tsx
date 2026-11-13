export default function Stories() {
  const stories = [
    {
      quote: 'I arrived exhausted and ashamed. The staff treated me with such kindness that I started believing in myself again.',
      author: 'Michael R.',
      tag: 'Completed the 90-day program',
      delay: '0s'
    },
    {
      quote: 'The family sessions changed everything. We finally learned how to talk to each other, and to listen.',
      author: 'Amina K.',
      tag: 'Family program participant',
      delay: '.1s'
    },
    {
      quote: 'Two years on, I still rely on the alumni community. Recovery didn’t end when I left, and neither did the support.',
      author: 'David T.',
      tag: 'Alumni member',
      delay: '.2s'
    }
  ];

  return (
    <section id="stories">
      <div className="container">
        <div className="section-head center reveal">
          <span className="eyebrow">Stories of Recovery</span>
          <h2>Words from those who walked the path</h2>
          <p>Shared with permission. Names have been changed to protect privacy.</p>
        </div>
        <div className="quotes">
          {stories.map((s, idx) => (
            <figure key={idx} className="quote reveal" style={{ margin: 0, ['--d' as any]: s.delay }}>
              <div>
                <div className="mark">“</div>
                <p>{s.quote}</p>
              </div>
              <footer>
                <strong>{s.author}</strong>
                {s.tag}
              </footer>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
