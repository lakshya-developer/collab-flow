import './App.css'

const featureCards = [
  {
    title: 'Task Boards',
    description: 'Create, assign, and move work across Kanban stages with a clear visual flow.',
  },
  {
    title: 'Team Alignment',
    description: 'Keep everyone informed with shared projects, comments, and milestone updates.',
  },
  {
    title: 'Progress Insights',
    description: 'Monitor workload and delivery status through a simple, modern dashboard.',
  },
]

function App() {
  return (
    <div className="page-shell">
      <header className="topbar">
        <a className="brand" href="#">
          <span className="brand-mark">C</span>
          CollabFlow
        </a>
        <nav className="nav-links">
          <a href="#features">Features</a>
          <a href="#about">Why it works</a>
          <a href="#signup">Get started</a>
        </nav>
      </header>

      <main className="hero-section">
        <section className="hero-copy">
          <span className="pill">Summer Internship Project</span>
          <h1>Manage projects with clarity, speed, and collaboration.</h1>
          <p>
            CollabFlow is a MERN stack project collaboration platform designed to help teams plan
            work, track delivery, and stay connected from idea to launch.
          </p>
          <div className="actions">
            <a className="btn btn-primary" href="#signup">
              Try the demo
            </a>
            <a className="btn btn-secondary" href="#features">
              Explore features
            </a>
          </div>
        </section>

        <section className="hero-panel" aria-label="Project preview">
          <div className="panel-header">
            <span className="dot red" />
            <span className="dot yellow" />
            <span className="dot green" />
          </div>
          <div className="panel-body">
            <div className="panel-card">
              <p className="panel-label">Sprint Overview</p>
              <h3>Website Redesign</h3>
              <ul>
                <li>Design review</li>
                <li>Frontend implementation</li>
                <li>QA sign-off</li>
              </ul>
            </div>
            <div className="panel-progress">
              <div>
                <strong>72%</strong>
                <span>Completed</span>
              </div>
              <div>
                <strong>4</strong>
                <span>Active tasks</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <section id="features" className="feature-section">
        <div className="section-heading">
          <p className="small-title">Core features</p>
          <h2>Everything a small team needs to stay organized.</h2>
        </div>
        <div className="feature-grid">
          {featureCards.map((feature) => (
            <article key={feature.title} className="feature-card">
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="about" className="about-section">
        <div className="about-card">
          <p className="small-title">Why this project stands out</p>
          <h2>Built as a practical full-stack experience.</h2>
          <p>
            From authentication and project CRUD to task tracking and responsive UI, this app gives
            interns a strong foundation in modern web development.
          </p>
        </div>
      </section>

      <section id="signup" className="cta-section">
        <h2>Ready to launch your next team milestone?</h2>
        <p>Bring your ideas together, assign work, and ship faster with CollabFlow.</p>
        <a className="btn btn-primary" href="#">
          Join the waitlist
        </a>
      </section>
    </div>
  )
}

export default App
