import { Router } from 'express'
import Task from '../models/Task.js'
import { authenticateToken } from '../middleware/auth.js'

const router = Router()

router.get('/', async (req, res) => {
  try {
    const items = await Task.find().sort({ createdAt: -1 })
    res.json(items)
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

router.get('/:taskId', async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId)
    if (!task) return res.status(404).json({ error: 'Task not found' })
    res.json(task)
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

router.post('/', authenticateToken, async (req, res) => {
  const { title, projectId, assignee, status, dueDate } = req.body
  if (!title || !projectId || !assignee) return res.status(400).json({ error: 'Missing required fields' })
  try {
    const t = new Task({ title, projectId, assignee, status: status || 'To Do', dueDate })
    await t.save()
    res.status(201).json(t)
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

router.put('/:taskId', authenticateToken, async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId)
    if (!task) return res.status(404).json({ error: 'Task not found' })
    const { title, projectId, assignee, status, dueDate } = req.body
    task.title = title ?? task.title
    task.projectId = projectId ?? task.projectId
    task.assignee = assignee ?? task.assignee
    task.status = status ?? task.status
    task.dueDate = dueDate ?? task.dueDate
    await task.save()
    res.json(task)
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

router.delete('/:taskId', authenticateToken, async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.taskId)
    if (!task) return res.status(404).json({ error: 'Task not found' })
    res.status(204).send()
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

export default router
