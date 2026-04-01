import axios from 'axios'

const API_BASE_URL = '/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const taskService = {
  getTasks: async (status = null) => {
    const url = status ? `/tasks?status=${status}` : '/tasks'
    const response = await api.get(url)
    return response.data
  },

  getTaskById: async (id) => {
    const response = await api.get(`/tasks/${id}`)
    return response.data
  },

  createTask: async (taskData) => {
    const response = await api.post('/tasks', taskData)
    return response.data
  },

  updateTask: async (id, taskData) => {
    const response = await api.put(`/tasks/${id}`, taskData)
    return response.data
  },

  deleteTask: async (id) => {
    await api.delete(`/tasks/${id}`)
  },
}
