export function About() {
  return (
    <div className="terminal-article">
      <div className="terminal-page-header">
        <h1 className="terminal-page-title">ABOUT</h1>
      </div>

      <div className="terminal-card fade-in-up">
        <div className="terminal-card-header">
          <span>ABOUT</span>
        </div>

        <div className="terminal-article-content">
          <p>
            <span style={{ color: 'var(--accent)' }}>$</span> cat ./about.txt
          </p>
          <p style={{ marginTop: '1.5rem' }}>
            This is a personal portfolio site showcasing projects and sharing
            learnings through a blog. Built with modern web technologies and a
            passion for clean, functional code.
          </p>
        </div>
      </div>
    </div>
  );
}
