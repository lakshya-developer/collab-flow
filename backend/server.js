import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { connectDB } from './db.js'
import authRouter from './routes/auth.js'
import projectsRouter from './routes/projects.js'
import tasksRouter from './routes/tasks.js'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

app.use('/api/auth', authRouter)
app.use('/api/projects', projectsRouter)
app.use('/api/tasks', tasksRouter)

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'CollabFlow backend is running' })
})

const port = process.env.PORT || 5000
const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/collabflow'

connectDB(mongoUri).then(() => {
  app.listen(port, () => {
    console.log(`Backend server listening on http://localhost:${port}`)
  })
})
