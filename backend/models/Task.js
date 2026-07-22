import mongoose from '../db.js'

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  assignee: { type: String },
  status: { type: String, default: 'To Do' },
  dueDate: { type: Date },
}, { timestamps: true })

export default mongoose.model('Task', taskSchema)
