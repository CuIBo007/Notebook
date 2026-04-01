import React, { useState, useEffect } from 'react'
import TaskForm from '../components/TaskForm'
import TaskList from '../components/TaskList'
import { taskService } from '../services/taskService'
import toast from 'react-hot-toast'
import './Pages.css'

const Home = () => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const tasksPerPage = 10

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      setLoading(true)
      const data = await taskService.getTasks('pending')
      setTasks(data)
    } catch (error) {
      toast.error('Failed to fetch tasks')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTask = async (taskData) => {
    try {
      const newTask = await taskService.createTask(taskData)
      setTasks([newTask, ...tasks])
      toast.success('Task created successfully')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create task')
    }
  }

  const handleUpdateTask = async (updatedTask) => {
    try {
      const task = await taskService.updateTask(updatedTask.id, updatedTask)
      setTasks(tasks.map(t => t.id === task.id ? task : t))
    } catch (error) {
      toast.error('Failed to update task')
      throw error
    }
  }

  const handleDeleteTask = async (taskId) => {
    try {
      await taskService.deleteTask(taskId)
      setTasks(tasks.filter(t => t.id !== taskId))
    } catch (error) {
      toast.error('Failed to delete task')
      throw error
    }
  }

  // Pagination
  const indexOfLastTask = currentPage * tasksPerPage
  const indexOfFirstTask = indexOfLastTask - tasksPerPage
  const currentTasks = tasks.slice(indexOfFirstTask, indexOfLastTask)
  const totalPages = Math.ceil(tasks.length / tasksPerPage)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  return (
    <div className="page-container">
      <h1 className="page-title">Enter The Task</h1>
      <TaskForm onSubmit={handleCreateTask} />
      <h1 className="page-title">Pending Tasks</h1>
      <TaskList 
        tasks={currentTasks}
        onUpdate={handleUpdateTask}
        onDelete={handleDeleteTask}
        loading={loading}
      />
      
      {totalPages > 1 && (
        <div className="pagination">
          <button 
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="page-btn"
          >
            Previous
          </button>
          <span className="page-info">
            Page {currentPage} of {totalPages}
          </span>
          <button 
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="page-btn"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}

export default Home
