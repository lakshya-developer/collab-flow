import { Link } from 'react-router-dom'
import GlobalNav from '../components/GlobalNav'
import './LandingPage.css'

const features = [
  {
    title: 'Project Boards',
    detail: 'Organize tasks, priorities, and milestones across teams with a visual kanban board.',
    iconClass: 'fi-sky',
    icon: (
      <svg viewBox="0 0 24 24" stroke="currentColor">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    title: 'Team Collaboration',
    detail: 'Add team members, assign work, share updates, and keep everyone aligned in real time.',
    iconClass: 'fi-violet',
    icon: (
      <svg viewBox="0 0 24 24" stroke="currentColor">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87" />
        <path d="M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
  },
  {
    title: 'Progress Metrics',
    detail: 'View task completion, workload distribution, and project health at a glance.',
    iconClass: 'fi-emerald',
    icon: (
      <svg viewBox="0 0 24 24" stroke="currentColor">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
]

export default function LandingPage() {
  return (
    <div className="landing-page">
      <GlobalNav />

      {/* ── hero ── */}
      <section className="landing-hero">
        <div className="hero-copy">
          <p className="eyebrow">Summer Internship Project</p>
          <h1>
            Build teamwork,{' '}
            <span className="gradient-text">manage projects</span>, and ship faster.
          </h1>
          <p>
            CollabFlow is a full-stack MERN collaboration tool built to demonstrate
            task workflows, project organization, and team management — all in one
            polished dashboard.
          </p>
          <div className="hero-actions">
            <Link className="button primary" to="/dashboard">
              <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
              Go to Dashboard
            </Link>
            <Link className="button outline" to="/register">
              Get Started Free
            </Link>
          </div>
        </div>

        {/* live preview card */}
        <div className="hero-preview">
          <div className="preview-card">
            <div className="preview-dots">
              <span className="dot-red" />
              <span className="dot-yellow" />
              <span className="dot-green" />
            </div>
            <div className="preview-heading">Current Sprint</div>
            <div className="preview-metric">8 of 12 tasks done</div>
            <div className="preview-progress-bar">
              <div className="preview-progress-fill" style={{ '--progress': '67%' }} />
            </div>
            <div className="preview-items">
              <div className="preview-task">
                <span>Design review</span>
                <span className="preview-status s-done">Done</span>
              </div>
              <div className="preview-task">
                <span>Implement board</span>
                <span className="preview-status s-progress">In Progress</span>
              </div>
              <div className="preview-task">
                <span>Team sync</span>
                <span className="preview-status s-todo">To Do</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── features ── */}
      <section className="landing-features">
        <p className="section-label">Features</p>
        <h2 className="section-title">Everything your team needs in one place</h2>
        <div className="feature-grid">
          {features.map((f) => (
            <article key={f.title} className="feature-card">
              <div className={`feature-icon ${f.iconClass}`}>{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.detail}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ── about ── */}
      <section className="landing-about">
        <div className="about-card">
          <h2>About This Project</h2>
          <p>
            CollabFlow is a summer internship project that showcases full-stack
            development with the MERN stack (MongoDB, Express, React, Node.js).
            It combines user authentication, project CRUD, task management with
            kanban boards, and a polished dashboard — all deployed as a single
            cohesive application.
          </p>
        </div>
      </section>

      {/* ── CTA footer ── */}
      <section className="landing-cta">
        <h2>Ready to get started?</h2>
        <p>Create a free account and start managing your projects today.</p>
        <div className="cta-buttons">
          <Link className="button primary" to="/register">
            Create an Account
          </Link>
          <Link className="button outline" to="/signin">
            Sign In
          </Link>
        </div>
      </section>
    </div>
  )
}
