import { Router } from 'express'
import Project from '../models/Project.js'
import { authenticateToken } from '../middleware/auth.js'

const router = Router()

router.get('/', async (req, res) => {
  try {
    const items = await Project.find().sort({ createdAt: -1 })
    res.json(items)
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

router.get('/:projectId', async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId)
    if (!project) return res.status(404).json({ error: 'Project not found' })
    res.json(project)
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

router.post('/', authenticateToken, async (req, res) => {
  const { name, owner, status, dueDate } = req.body
  if (!name || !owner) return res.status(400).json({ error: 'Missing required fields' })
  try {
    const p = new Project({ name, owner, status: status || 'To Do', dueDate })
    await p.save()
    res.status(201).json(p)
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

router.put('/:projectId', authenticateToken, async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId)
    if (!project) return res.status(404).json({ error: 'Project not found' })
    const { name, owner, status, dueDate } = req.body
    project.name = name ?? project.name
    project.owner = owner ?? project.owner
    project.status = status ?? project.status
    project.dueDate = dueDate ?? project.dueDate
    await project.save()
    res.json(project)
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

router.delete('/:projectId', authenticateToken, async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.projectId)
    if (!project) return res.status(404).json({ error: 'Project not found' })
    res.status(204).send()
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

export default router
