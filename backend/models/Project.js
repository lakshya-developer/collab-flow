import mongoose from '../db.js'

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  owner: { type: String, required: true },
  status: { type: String, default: 'To Do' },
  dueDate: { type: Date },
}, { timestamps: true })

export default mongoose.model('Project', projectSchema)
