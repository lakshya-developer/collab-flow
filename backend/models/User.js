import mongoose from '../db.js'

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'member' },
}, { timestamps: true })

export default mongoose.model('User', userSchema)
