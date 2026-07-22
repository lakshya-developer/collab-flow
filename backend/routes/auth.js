import { Router } from 'express'
import User from '../models/User.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const router = Router()

router.post('/login', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ error: 'Missing fields' })
  try {
    const user = await User.findOne({ email })
    if (!user) return res.status(401).json({ error: 'Invalid credentials' })

    const ok = await bcrypt.compare(password, user.password)
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' })

    const secret = process.env.JWT_SECRET || 'dev-secret'
    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, secret, { expiresIn: '7d' })

    res.json({ id: user._id, name: user.name, email: user.email, role: user.role, token })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body
  if (!name || !email || !password) return res.status(400).json({ error: 'Missing fields' })
  try {
    const existing = await User.findOne({ email })
    if (existing) return res.status(409).json({ error: 'Email exists' })

    const hashed = await bcrypt.hash(password, 10)
    const user = new User({ name, email, password: hashed })
    await user.save()

    const secret = process.env.JWT_SECRET || 'dev-secret'
    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, secret, { expiresIn: '7d' })

    res.status(201).json({ id: user._id, name: user.name, email: user.email, role: user.role, token })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

export default router
