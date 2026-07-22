import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import GlobalNav from '../components/GlobalNav'
import { fetchProject } from '../api/projects'
import { fetchTasks, createTask, updateTask, deleteTask } from '../api/tasks'
import './ProjectDetailPage.css'

const STATUSES = ['To Do', 'In Progress', 'Review', 'Done']

/* helper: status → CSS class */
function statusClass(raw = '') {
  const s = raw.toLowerCase().replace(/\s+/g, '')
  if (s === 'inprogress') return 'inprogress'
  if (s === 'review') return 'review'
  if (s === 'done') return 'done'
  return 'todo'
}

export default function ProjectDetailPage() {
  const { projectId } = useParams()
  const [project, setProject] = useState(null)
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState('')
  const [assignee, setAssignee] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  /* fetch project + tasks */
  useEffect(() => {
    let mounted = true
    setLoading(true)

    Promise.allSettled([fetchProject(projectId), fetchTasks()])
      .then(([pRes, tRes]) => {
        if (!mounted) return
        if (pRes.status === 'fulfilled') setProject(pRes.value)
        if (tRes.status === 'fulfilled') {
          const projectTasks = tRes.value
            .filter((t) => t.projectId === projectId)
            .map((t) => ({ ...t, id: t._id }))
          setTasks(projectTasks)
        }
      })
      .finally(() => mounted && setLoading(false))

    return () => { mounted = false }
  }, [projectId])

  async function handleCreate(e) {
    e.preventDefault()
    setError(null)
    try {
      const t = await createTask({ title, projectId, assignee })
      setTasks((cur) => [{ ...t, id: t._id }, ...cur])
      setTitle('')
      setAssignee('')
    } catch (err) {
      setError(err.response?.data?.error || 'Create failed')
    }
  }

  async function handleMove(task) {
    const idx = STATUSES.indexOf(task.status || 'To Do')
    const next = STATUSES[Math.min(STATUSES.length - 1, idx + 1)]
    try {
      const updated = await updateTask(task._id || task.id, { status: next })
      setTasks((cur) => cur.map((c) => (c._id === updated._id ? { ...updated, id: updated._id } : c)))
    } catch (err) {
      console.error(err)
    }
  }

  async function handleDelete(task) {
    try {
      await deleteTask(task._id || task.id)
      setTasks((cur) => cur.filter((c) => c._id !== (task._id || task.id)))
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) {
    return (
      <div>
        <GlobalNav />
        <main className="detail-page">
          <p className="detail-loading">Loading project…</p>
        </main>
      </div>
    )
  }

  return (
    <div>
      <GlobalNav />
      <main className="detail-page">
        {/* hero */}
        <header className="detail-hero">
          <div className="detail-hero-left">
            <p className="detail-eyebrow">Project</p>
            <h1>{project ? project.name : 'Not found'}</h1>
            {project && (
              <div className="detail-hero-meta">
                <span className="detail-owner">{project.owner}</span>
                <span className={`status-pill ${statusClass(project.status)}`}>{project.status || 'To Do'}</span>
              </div>
            )}
          </div>
          <div className="detail-hero-right">
            <Link to="/projects" className="detail-link">
              <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6" /></svg>
              Projects
            </Link>
            <Link to="/projects/board" className="detail-link">
              <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>
              Board
            </Link>
          </div>
        </header>

        {/* body: create form + task list */}
        <div className="detail-body">
          {/* left: create task */}
          <section className="detail-panel">
            <h3>Create Task</h3>
            <form className="create-task-form" onSubmit={handleCreate}>
              <div className="ctf-field">
                <label htmlFor="task-title">Title</label>
                <input
                  id="task-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Design landing page"
                  required
                />
              </div>
              <div className="ctf-field">
                <label htmlFor="task-assignee">Assignee</label>
                <input
                  id="task-assignee"
                  value={assignee}
                  onChange={(e) => setAssignee(e.target.value)}
                  placeholder="e.g. Alex"
                  required
                />
              </div>
              <button type="submit" className="ctf-submit">
                <svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                Create Task
              </button>
            </form>
            {error && <p className="ctf-error">{error}</p>}
          </section>

          {/* right: task list */}
          <section className="detail-panel">
            <h3>Tasks ({tasks.length})</h3>
            {tasks.length === 0 ? (
              <div className="detail-empty">
                <svg viewBox="0 0 24 24" stroke="currentColor" fill="none">
                  <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
                  <rect x="9" y="3" width="6" height="4" rx="1" />
                </svg>
                <p>No tasks yet. Create one to get started!</p>
              </div>
            ) : (
              <ul className="detail-task-list">
                {tasks.map((t) => (
                  <li key={t._id || t.id} className="dtask">
                    <div className="dtask-info">
                      <span className="dtask-title">{t.title}</span>
                      <span className="dtask-assignee">{t.assignee}</span>
                    </div>
                    <div className="dtask-right">
                      <span className={`status-pill ${statusClass(t.status)}`}>{t.status || 'To Do'}</span>
                      {t.status !== 'Done' && (
                        <button className="dtask-btn move-btn" onClick={() => handleMove(t)}>
                          <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6" /></svg>
                          Move
                        </button>
                      )}
                      <button className="dtask-btn delete-btn" onClick={() => handleDelete(t)}>
                        <svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" /></svg>
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </main>
    </div>
  )
}
