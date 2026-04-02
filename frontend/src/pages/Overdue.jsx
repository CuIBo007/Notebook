import React, { useState, useEffect } from 'react'
import TaskList from '../components/TaskList'
import { useTaskStore } from '../store/taskStore'
import './Pages.css'

const Overdue = () => {
  const { tasks, loading, fetchTasks, updateTask, deleteTask } = useTaskStore()
  const [currentPage, setCurrentPage] = useState(1)
  const tasksPerPage = 10

  useEffect(() => {
    fetchTasks()
  }, [])

  const overdueTasks = tasks.filter(t => t.status === 'Overdue')

  const indexOfLastTask = currentPage * tasksPerPage
  const indexOfFirstTask = indexOfLastTask - tasksPerPage
  const currentTasks = overdueTasks.slice(indexOfFirstTask, indexOfLastTask)
  const totalPages = Math.ceil(overdueTasks.length / tasksPerPage)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  return (
    <div className="page-container">
      <h1 className="page-title">Overdue Tasks</h1>
      <TaskList 
        tasks={currentTasks}
        onUpdate={updateTask}
        onDelete={deleteTask}
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
