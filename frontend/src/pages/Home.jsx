import React, { useState, useEffect } from 'react'
import TaskForm from '../components/TaskForm'
import TaskList from '../components/TaskList'
import { useTaskStore } from '../store/taskStore'
import './Pages.css'

const Home = () => {
  const { tasks, loading, fetchTasks, createTask, updateTask, deleteTask } = useTaskStore()
  const [currentPage, setCurrentPage] = useState(1)
  const tasksPerPage = 10

  useEffect(() => {
    console.log("🔄 Home: Fetching tasks...")
    fetchTasks()
  }, [])

  // Convert UTC to Nepal Time safely (removes ambiguity)
  const formatNepalTime = (date) => {
    if (!date) return "No due date";

    const parsed = new Date(date);
    
    if (isNaN(parsed)) return "Invalid date";

    // ✅ SAFE: Explicit timezone conversion removes ambiguity
    return parsed.toLocaleString("en-US", {
      timeZone: "Asia/Kathmandu",
      year: "numeric",
      month: "short", 
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false // 24-hour format
    })
  }

  // Filter for pending tasks
  const pendingTasks = tasks.filter(t => !t.isCompleted && t.status !== 'Overdue')
  
  // Debug logging
  console.log("🏠 Home Debug:")
  console.log("  - All tasks:", tasks)
  console.log("  - Pending tasks:", pendingTasks)
  console.log("  - Loading:", loading)
  
  // Verify Date objects
  tasks.forEach(task => {
    console.log(`  🔍 Task ${task.id} dueAt type: ${typeof task.dueAt}, is Date: ${task.dueAt instanceof Date}`)
  })
  
  // Debug each pending task's due date with formatting
  pendingTasks.forEach(task => {
    console.log(`  📅 Task ${task.id}: ${task.title} - Due: ${formatNepalTime(task.dueAt)} - Status: ${task.status}`)
  })

  // Pagination
  const indexOfLastTask = currentPage * tasksPerPage
  const indexOfFirstTask = indexOfLastTask - tasksPerPage
  const currentTasks = pendingTasks.slice(indexOfFirstTask, indexOfLastTask)
  const totalPages = Math.ceil(pendingTasks.length / tasksPerPage)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  // Loading guard
  if (loading) {
    return (
      <div className="page-container">
        <h1 className="page-title">Loading tasks...</h1>
      </div>
    )
  }

  return (
    <div className="page-container">
      <h1 className="page-title">Enter The Task</h1>
      <TaskForm onSubmit={createTask} />
      <h1 className="page-title">Pending Tasks</h1>
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

export default Home
