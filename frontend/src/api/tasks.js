import api from './client'

export async function fetchTasks() {
  const res = await api.get('/tasks')
  return res.data
}

export async function createTask(payload) {
  const res = await api.post('/tasks', payload)
  return res.data
}

export async function updateTask(taskId, payload) {
  const res = await api.put(`/tasks/${taskId}`, payload)
  return res.data
}

export async function deleteTask(taskId) {
  const res = await api.delete(`/tasks/${taskId}`)
  return res.data
}
