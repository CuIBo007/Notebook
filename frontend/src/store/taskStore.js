import { create } from 'zustand'
import { taskService } from '../services/taskService'
import toast from 'react-hot-toast'

// Helper: Convert API timestamps to Date objects
const processTaskFromAPI = (task) => ({
  ...task,
  createdAt: new Date(task.createdAt),
  dueAt: new Date(task.dueAt),
})

export const useTaskStore = create((set, get) => ({
  tasks: [],
  loading: false,

  // 🔹 Fetch All Tasks (fetch once, filter in UI)
  fetchTasks: async () => {
    console.log("🔄 Store: Starting fetchTasks...")
    set({ loading: true })
    try {
      // Pass null to get all tasks (not 'all')
      const tasksFromAPI = await taskService.getTasks(null)
      console.log("📦 Tasks from API:", tasksFromAPI)
      
      // Convert all timestamps to Date objects
      const tasks = tasksFromAPI.map(processTaskFromAPI)
      console.log("✅ Processed tasks with Date objects:", tasks)

      set({ tasks })
      console.log("✅ Tasks stored in Zustand")
    } catch (error) {
      console.error("❌ Fetch error:", error)
      toast.error('Failed to fetch tasks')
    } finally {
      console.log("🏁 Fetch completed, setting loading to false")
      set({ loading: false })
    }
  },

  // 🔹 Create Task
  createTask: async (taskData) => {
    try {
      const taskFromAPI = await taskService.createTask(taskData)
      
      // Convert timestamps to Date objects
      const newTask = processTaskFromAPI(taskFromAPI)
      
      set(state => ({
        tasks: [newTask, ...state.tasks]
      }))
      toast.success('Task created successfully')
      return newTask
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create task')
      throw error
    }
  },

  // 🔹 Update Task
  updateTask: async (updatedTask) => {
    try {
      console.log("🔄 Store: Updating task:", updatedTask)
      const taskFromAPI = await taskService.updateTask(updatedTask.id, updatedTask)
      console.log("✅ Updated task from API:", taskFromAPI)
      
      // Convert timestamps to Date objects
      const task = processTaskFromAPI(taskFromAPI)
      console.log("✅ Processed updated task with Date objects:", task)
      
      // 🔥 HARD FIX: force sync with backend for guaranteed consistency
      console.log("🔄 Forcing fresh data fetch after update...")
      const freshTasksFromAPI = await taskService.getTasks(null)
      const freshTasks = freshTasksFromAPI.map(processTaskFromAPI)
      set({ tasks: freshTasks })
      console.log("✅ Store refreshed with fresh data")
      
      toast.success('Task updated successfully')
      return task
    } catch (error) {
      console.error("❌ Update error:", error)
      toast.error('Failed to update task')
      throw error
    }
  },

  // 🔹 Delete Task
  deleteTask: async (taskId) => {
    try {
      await taskService.deleteTask(taskId)
      set(state => ({
        tasks: state.tasks.filter(t => t.id !== taskId)
      }))
      toast.success('Task deleted successfully')
    } catch (error) {
      toast.error('Failed to delete task')
      throw error
    }
  },

  // 🔹 Getters for filtered tasks (optional helper)
  getPendingTasks: () => {
    const { tasks } = get()
    return tasks.filter(t => !t.isCompleted && t.status !== 'Overdue')
  },

  getCompletedTasks: () => {
    const { tasks } = get()
    return tasks.filter(t => t.isCompleted)
  },

  getOverdueTasks: () => {
    const { tasks } = get()
    return tasks.filter(t => t.status === 'Overdue')
  }
}))
