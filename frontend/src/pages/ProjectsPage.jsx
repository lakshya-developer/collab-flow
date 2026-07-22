import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import GlobalNav from '../components/GlobalNav'
import { fetchProjects, createProject, updateProject, deleteProject } from '../api/projects'
import './ProjectsPage.css'

/* helper: status → CSS class */
function statusClass(raw = '') {
  const s = raw.toLowerCase().replace(/\s+/g, '')
  if (s === 'inprogress') return 'inprogress'
  if (s === 'review') return 'review'
  if (s === 'done') return 'done'
  return 'todo'
}

const fmtDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : null

export default function ProjectsPage() {
  const [projects, setProjects] = useState([])
  const [name, setName] = useState('')
  const [owner, setOwner] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const items = await fetchProjects()
        if (!mounted) return
        setProjects(items)
      } catch (err) {
        console.error(err)
      }
    })()
    return () => (mounted = false)
  }, [])

  async function handleCreate(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const p = await createProject({ name, owner })
      setProjects((cur) => [p, ...cur])
      setName('')
      setOwner('')
      navigate(`/projects/${p._id}`)
    } catch (err) {
      setError(err.response?.data?.error || 'Create failed')
    } finally {
      setLoading(false)
    }
  }

  async function handleSave(id, updated) {
    try {
      const saved = await updateProject(id, updated)
      setProjects((cur) => cur.map((c) => (c._id === saved._id ? saved : c)))
    } catch (err) {
      console.error('Update failed', err)
    }
  }

  async function handleDelete(id) {
    try {
      await deleteProject(id)
      setProjects((cur) => cur.filter((c) => c._id !== id))
    } catch (err) {
      console.error('Delete failed', err)
    }
  }

  return (
    <div>
      <GlobalNav />
      <main className="projects-page">
        {/* header */}
        <header className="projects-header">
          <div className="projects-header-left">
            <p className="projects-eyebrow">Projects</p>
            <h1>All Projects</h1>
            <p className="projects-count">{projects.length} project{projects.length !== 1 && 's'}</p>
          </div>
          <Link to="/dashboard">
            <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6" /></svg>
            Dashboard
          </Link>
        </header>

        {/* create panel */}
        <section className="projects-create-panel">
          <h3>Create a new project</h3>
          <form className="create-form" onSubmit={handleCreate}>
            <div className="create-field">
              <label htmlFor="create-name">Project name</label>
              <input
                id="create-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Website Redesign"
                required
              />
            </div>
            <div className="create-field">
              <label htmlFor="create-owner">Owner</label>
              <input
                id="create-owner"
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                placeholder="e.g. Alex"
                required
              />
            </div>
            <button type="submit" className="create-btn" disabled={loading}>
              <svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
              {loading ? 'Creating…' : 'Create'}
            </button>
          </form>
          {error && <p className="create-error">{error}</p>}
        </section>

        {/* card grid */}
        {projects.length === 0 ? (
          <div className="projects-empty">
            <svg viewBox="0 0 24 24" stroke="currentColor" fill="none">
              <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            <p>No projects yet. Create your first one above!</p>
          </div>
        ) : (
          <div className="project-cards-grid">
            {projects.map((p) => (
              <ProjectCard
                key={p._id}
                project={p}
                onSave={(updated) => handleSave(p._id, updated)}
                onDelete={() => handleDelete(p._id)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

/* ── Project Card ── */
function ProjectCard({ project, onSave, onDelete }) {
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(project.name)
  const [owner, setOwner] = useState(project.owner)

  function startEdit() {
    setName(project.name)
    setOwner(project.owner)
    setEditing(true)
  }

  async function save() {
    await onSave({ name, owner })
    setEditing(false)
  }

  if (editing) {
    return (
      <article className="pcard">
        <div className="pcard-edit">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Project name" />
          <input value={owner} onChange={(e) => setOwner(e.target.value)} placeholder="Owner" />
          <div className="pcard-edit-actions">
            <button className="pcard-btn" onClick={save}>
              <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>
              Save
            </button>
            <button className="pcard-btn" onClick={() => setEditing(false)}>
              Cancel
            </button>
          </div>
        </div>
      </article>
    )
  }

  return (
    <article className="pcard">
      <h2 className="pcard-name">{project.name}</h2>
      <p className="pcard-owner">{project.owner}</p>
      <div className="pcard-meta">
        <span className={`status-pill ${statusClass(project.status)}`}>{project.status || 'To Do'}</span>
        {project.dueDate && <span className="pcard-due">Due {fmtDate(project.dueDate)}</span>}
      </div>
      <div className="pcard-actions">
        <Link to={`/projects/${project._id}`} className="pcard-btn">
          <svg viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
          Open
        </Link>
        <Link to="/projects/board" className="pcard-btn">
          <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>
          Board
        </Link>
        <button className="pcard-btn" onClick={startEdit}>
          <svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
          Edit
        </button>
        <button className="pcard-btn danger" onClick={onDelete}>
          <svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" /></svg>
          Delete
        </button>
      </div>
    </article>
  )
}
