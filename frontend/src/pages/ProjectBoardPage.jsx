import { useMemo, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import GlobalNav from '../components/GlobalNav'
import { fetchProjects } from '../api/projects'
import { fetchTasks, updateTask } from '../api/tasks'
import './ProjectBoardPage.css'

const STATUSES = ['To Do', 'In Progress', 'Review', 'Done']

/* helper: status → CSS class */
function colClass(status) {
  const s = status.toLowerCase().replace(/\s+/g, '')
  if (s === 'inprogress') return 'col-inprogress'
  if (s === 'review') return 'col-review'
  if (s === 'done') return 'col-done'
  return 'col-todo'
}

function pillClass(raw = '') {
  const s = raw.toLowerCase().replace(/\s+/g, '')
  if (s === 'inprogress') return 'inprogress'
  if (s === 'review') return 'review'
  if (s === 'done') return 'done'
  return 'todo'
}

const fmtDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : ''

export default function ProjectBoardPage() {
  const [projects, setProjects] = useState([])
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    setLoading(true)

    Promise.allSettled([fetchProjects(), fetchTasks()])
      .then(([pRes, tRes]) => {
        if (!mounted) return
        setProjects(pRes.status === 'fulfilled' ? pRes.value : [])
        if (tRes.status === 'fulfilled') {
          const normalized = tRes.value.map((t) => ({
            id: t._id,
            title: t.title,
            owner: t.assignee || 'Unassigned',
            due: t.dueDate ? fmtDate(t.dueDate) : '',
            status: t.status || 'To Do',
          }))
          setTasks(normalized)
        } else {
          setTasks([])
        }
      })
      .finally(() => mounted && setLoading(false))

    return () => { mounted = false }
  }, [])

  const tasksByStatus = useMemo(
    () =>
      STATUSES.reduce((acc, status) => {
        acc[status] = tasks.filter((task) => task.status === status)
        return acc
      }, {}),
    [tasks],
  )

  async function moveTask(taskId, nextStatus) {
    /* optimistic update */
    setTasks((current) =>
      current.map((task) =>
        task.id === taskId ? { ...task, status: nextStatus } : task,
      ),
    )
    try {
      await updateTask(taskId, { status: nextStatus })
    } catch (err) {
      console.error('Move failed', err)
    }
  }

  return (
    <div>
      <GlobalNav />
      <main className="board-page">
        {/* hero */}
        <header className="board-hero">
          <div className="board-hero-left">
            <p className="board-eyebrow">Task Board</p>
            <h1>Kanban Board</h1>
            <p>Drag-ready task columns. Move tasks through your workflow stages.</p>
          </div>
          <div className="board-hero-right">
            <Link to="/dashboard" className="board-link">
              <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6" /></svg>
              Dashboard
            </Link>
            <Link to="/projects" className="board-link">
              <svg viewBox="0 0 24 24"><path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>
              Projects
            </Link>
          </div>
        </header>

        {/* project summary strip */}
        {projects.length > 0 && (
          <div className="board-projects-strip">
            {projects.map((p) => (
              <Link to={`/projects/${p._id}`} className="bps-card" key={p._id}>
                <h3>{p.name}</h3>
                <p className="bps-owner">{p.owner}</p>
                <div className="bps-meta">
                  <span className={`status-pill ${pillClass(p.status)}`}>{p.status || 'To Do'}</span>
                  {p.dueDate && <span className="bps-due">Due {fmtDate(p.dueDate)}</span>}
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* kanban columns */}
        <section className="board-columns">
          {loading ? (
            <>
              <div className="skeleton skel-col" />
              <div className="skeleton skel-col" />
              <div className="skeleton skel-col" />
              <div className="skeleton skel-col" />
            </>
          ) : (
            STATUSES.map((status) => (
              <div key={status} className={`board-column ${colClass(status)}`}>
                <h3>{status}</h3>
                <p className="column-count">{tasksByStatus[status].length} task{tasksByStatus[status].length !== 1 && 's'}</p>

                <div className="board-task-list">
                  {tasksByStatus[status].length === 0 ? (
                    <div className="column-empty">No tasks here yet</div>
                  ) : (
                    tasksByStatus[status].map((task) => (
                      <article key={task.id} className="btask">
                        <span className="btask-title">{task.title}</span>
                        <span className="btask-owner">{task.owner}</span>
                        <div className="btask-footer">
                          <span className="btask-due">{task.due}</span>
                          {status !== 'Done' ? (
                            <button
                              type="button"
                              className="btask-move"
                              onClick={() =>
                                moveTask(task.id, STATUSES[STATUSES.indexOf(status) + 1])
                              }
                            >
                              <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6" /></svg>
                              Move
                            </button>
                          ) : (
                            <span className="done-label">✓ Complete</span>
                          )}
                        </div>
                      </article>
                    ))
                  )}
                </div>
              </div>
            ))
          )}
        </section>
      </main>
    </div>
  )
}
