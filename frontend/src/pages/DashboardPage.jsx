import { Link } from 'react-router-dom'
import { useEffect, useState, useMemo } from 'react'
import { fetchProjects } from '../api/projects'
import { fetchTasks } from '../api/tasks'
import { useAuth } from '../contexts/AuthContext'
import GlobalNav from '../components/GlobalNav'
import './DashboardPage.css'

/* ── helper: turn a status string into a CSS class token ── */
function statusClass(raw = '') {
  const s = raw.toLowerCase().replace(/\s+/g, '')
  if (s === 'inprogress') return 'inprogress'
  if (s === 'review')     return 'review'
  if (s === 'done')       return 'done'
  return 'todo'
}

/* ── date formatter ── */
const fmtDate = (iso) => {
  if (!iso) return null
  return new Date(iso).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  })
}

const today = new Date().toLocaleDateString(undefined, {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
})

/* ================================================================
   Dashboard Page
   ================================================================ */
export default function DashboardPage() {
  const { user } = useAuth()
  const [projects, setProjects] = useState([])
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  /* ── fetch data ── */
  useEffect(() => {
    let mounted = true
    setLoading(true)

    Promise.allSettled([fetchProjects(), fetchTasks()])
      .then(([pRes, tRes]) => {
        if (!mounted) return
        setProjects(pRes.status === 'fulfilled' ? pRes.value : [])
        setTasks(tRes.status === 'fulfilled' ? tRes.value : [])
      })
      .finally(() => mounted && setLoading(false))

    return () => { mounted = false }
  }, [])

  /* ── derived data ── */
  const stats = useMemo(() => {
    const inProgress = tasks.filter((t) => t.status?.toLowerCase().replace(/\s+/g, '') === 'inprogress').length
    const completed  = tasks.filter((t) => t.status?.toLowerCase() === 'done').length
    return {
      totalProjects: projects.length,
      totalTasks: tasks.length,
      inProgress,
      completed,
    }
  }, [projects, tasks])

  const recentProjects = useMemo(
    () => [...projects].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)).slice(0, 4),
    [projects],
  )

  const myTasks = useMemo(() => {
    if (!user) return tasks
    const name = user.name?.toLowerCase()
    return tasks.filter((t) => t.assignee?.toLowerCase() === name)
  }, [tasks, user])

  /* ── build project lookup for task labels ── */
  const projectMap = useMemo(() => {
    const map = {}
    projects.forEach((p) => { map[p._id] = p.name })
    return map
  }, [projects])

  /* ================================================================
     Render
     ================================================================ */
  return (
    <div>
      <GlobalNav />

      <main className="dash">
        {/* ── header ── */}
        <header className="dash-header">
          <div className="dash-greeting">
            <p className="dash-eyebrow">Dashboard</p>
            <h1>Welcome back, {user?.name || 'there'}.</h1>
            <p className="dash-date">{today}</p>
          </div>
          <Link to="/projects" className="dash-cta">
            <svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            New Project
          </Link>
        </header>

        {/* ── stats ribbon ── */}
        <section className="stats-ribbon" aria-label="Overview statistics">
          {loading ? (
            <>
              <div className="skeleton skel-stat" />
              <div className="skeleton skel-stat" />
              <div className="skeleton skel-stat" />
              <div className="skeleton skel-stat" />
            </>
          ) : (
            <>
              <StatCard accent="sky" label="Projects" value={stats.totalProjects}
                icon={<svg viewBox="0 0 24 24" stroke="currentColor"><path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/></svg>} />
              <StatCard accent="violet" label="Total Tasks" value={stats.totalTasks}
                icon={<svg viewBox="0 0 24 24" stroke="currentColor"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/></svg>} />
              <StatCard accent="amber" label="In Progress" value={stats.inProgress}
                icon={<svg viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>} />
              <StatCard accent="emerald" label="Completed" value={stats.completed}
                icon={<svg viewBox="0 0 24 24" stroke="currentColor"><polyline points="20 6 9 17 4 12"/></svg>} />
            </>
          )}
        </section>

        {/* ── two-column: recent projects + my tasks ── */}
        <div className="dash-body">
          {/* left: recent projects */}
          <section>
            <div className="dash-section-heading">
              <h2>Recent Projects</h2>
              <Link to="/projects">View all →</Link>
            </div>

            <div className="glass-panel">
              {loading ? (
                <div className="recent-projects-grid">
                  <div className="skeleton skel-card" />
                  <div className="skeleton skel-card" />
                  <div className="skeleton skel-card" />
                  <div className="skeleton skel-card" />
                </div>
              ) : recentProjects.length === 0 ? (
                <div className="empty-state">
                  <svg viewBox="0 0 24 24" stroke="currentColor" fill="none"><path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/></svg>
                  <p>No projects yet.</p>
                  <Link to="/projects">Create your first project →</Link>
                </div>
              ) : (
                <div className="recent-projects-grid">
                  {recentProjects.map((p) => (
                    <Link to={`/projects/${p._id}`} className="rp-card" key={p._id}>
                      <span className="rp-name">{p.name}</span>
                      <span className="rp-owner">{p.owner}</span>
                      <div className="rp-meta">
                        <span className={`status-pill ${statusClass(p.status)}`}>{p.status || 'To Do'}</span>
                        {p.dueDate && <span className="rp-due">Due {fmtDate(p.dueDate)}</span>}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* right: my tasks */}
          <section>
            <div className="dash-section-heading">
              <h2>My Tasks</h2>
              <Link to="/projects/board">Board →</Link>
            </div>

            <div className="glass-panel">
              {loading ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  <div className="skeleton skel-task" />
                  <div className="skeleton skel-task" />
                  <div className="skeleton skel-task" />
                  <div className="skeleton skel-task" />
                </div>
              ) : myTasks.length === 0 ? (
                <div className="empty-state">
                  <svg viewBox="0 0 24 24" stroke="currentColor" fill="none"><polyline points="20 6 9 17 4 12"/></svg>
                  <p>No tasks assigned to you.</p>
                  <Link to="/projects">Go to a project to create tasks →</Link>
                </div>
              ) : (
                <ul className="task-list">
                  {myTasks.map((t) => (
                    <li key={t._id} className="task-item">
                      <div className="task-info">
                        <span className="task-title">{t.title}</span>
                        {t.projectId && projectMap[t.projectId] && (
                          <span className="task-project-label">{projectMap[t.projectId]}</span>
                        )}
                      </div>
                      <div className="task-right">
                        {t.dueDate && <span className="task-due">{fmtDate(t.dueDate)}</span>}
                        <span className={`status-pill ${statusClass(t.status)}`}>{t.status || 'To Do'}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        </div>

        {/* ── quick links ── */}
        <section>
          <div className="dash-section-heading" style={{ animationDelay: '0.22s' }}>
            <h2>Quick Links</h2>
          </div>

          <div className="quick-links">
            <Link to="/projects" className="ql-card">
              <span className="ql-icon ql-projects">
                <svg viewBox="0 0 24 24" stroke="currentColor"><path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/></svg>
              </span>
              All Projects
            </Link>

            <Link to="/projects/board" className="ql-card">
              <span className="ql-icon ql-board">
                <svg viewBox="0 0 24 24" stroke="currentColor"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
              </span>
              Task Board
            </Link>

            <Link to="/projects" className="ql-card">
              <span className="ql-icon ql-create">
                <svg viewBox="0 0 24 24" stroke="currentColor"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              </span>
              Create Project
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}

/* ── stat card component ── */
function StatCard({ accent, label, value, icon }) {
  return (
    <div className={`stat-card accent-${accent}`}>
      <span className="stat-icon">{icon}</span>
      <span className="stat-value">{value}</span>
      <span className="stat-label">{label}</span>
    </div>
  )
}
