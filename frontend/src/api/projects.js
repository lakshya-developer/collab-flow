import api from './client'

export async function fetchProjects() {
  const res = await api.get('/projects')
  return res.data
}

export async function createProject(payload) {
  const res = await api.post('/projects', payload)
  return res.data
}

export async function fetchProject(projectId) {
  const res = await api.get(`/projects/${projectId}`)
  return res.data
}

export async function updateProject(projectId, payload) {
  const res = await api.put(`/projects/${projectId}`, payload)
  return res.data
}

export async function deleteProject(projectId) {
  const res = await api.delete(`/projects/${projectId}`)
  return res.data
}
