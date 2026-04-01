import React, { useState, useEffect } from 'react'
import TaskList from '../components/TaskList'
import { taskService } from '../services/taskService'
import toast from 'react-hot-toast'
import './Pages.css'

const Overdue = () => {
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
      const data = await taskService.getTasks('overdue')
      setTasks(data)
    } catch (error) {
      toast.error('Failed to fetch overdue tasks')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateTask = async (updatedTask) => {
    try {
      const task = await taskService.updateTask(updatedTask.id, updatedTask)
      if (task.isCompleted || task.status !== 'Overdue') {
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
      const updatedTasks = tasks.filter(t => t.id !== taskId)
      setTasks(updatedTasks)
      
      // If last item on page deleted, go to previous page
      if (currentPage > 1 && updatedTasks.length <= (currentPage - 1) * tasksPerPage) {
        setCurrentPage(prev => prev - 1)
      }
      
      toast.success('Task deleted successfully')
    } catch (error) {
      toast.error('Failed to delete task')
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
      <h1 className="page-title">Overdue Tasks</h1>
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

export default Overdue
