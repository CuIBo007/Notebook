import React, { useState, useEffect } from 'react'
import TaskList from '../components/TaskList'
import { taskService } from '../services/taskService'
import toast from 'react-hot-toast'
import './Pages.css'

const Completed = () => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      setLoading(true)
      const data = await taskService.getTasks('completed')
      setTasks(data)
    } catch (error) {
      toast.error('Failed to fetch completed tasks')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateTask = async (updatedTask) => {
    try {
      const task = await taskService.updateTask(updatedTask.id, updatedTask)
      if (!task.isCompleted) {
        setTasks(tasks.filter(t => t.id !== task.id))
      } else {
        setTasks(tasks.map(t => t.id === task.id ? task : t))
      }
    } catch (error) {
      toast.error('Failed to update task')
    }
  }

  const handleDeleteTask = async (taskId) => {
    try {
      await taskService.deleteTask(taskId)
      setTasks(tasks.filter(t => t.id !== taskId))
      toast.success('Task deleted successfully')
    } catch (error) {
      toast.error('Failed to delete task')
    }
  }

  return (
    <div className="page-container">
      <h1 className="page-title">Completed Tasks</h1>
      <TaskList 
        tasks={tasks}
        onUpdate={handleUpdateTask}
        onDelete={handleDeleteTask}
        loading={loading}
      />
    </div>
  )
}

export default Completed
