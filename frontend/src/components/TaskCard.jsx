import React, { useState } from 'react'
import { formatDistanceToNow, format } from 'date-fns'
import toast from 'react-hot-toast'
import './TaskCard.css'

const TaskCard = ({ task, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editedTask, setEditedTask] = useState({ ...task })
  const [duration, setDuration] = useState({
    value: 1,
    unit: 'days'
  })

  const getStatusColor = (status) => {
    switch(status) {
      case 'Completed': return '#10b981'
      case 'Overdue': return '#ef4444'
      default: return '#f59e0b'
    }
  }

  const handleToggleComplete = async () => {
    const updatedTask = {
      ...task,
      isCompleted: !task.isCompleted
    }
    await onUpdate(updatedTask)
    toast.success(`Task marked as ${!task.isCompleted ? 'completed' : 'pending'}`)
  }

  const handleEdit = () => {
    setIsEditing(true)
    // Initialize duration based on current due date
    const now = new Date()
    const dueDate = new Date(task.dueAt)
    const diffMs = dueDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
    
    if (diffDays > 0) {
      if (diffDays >= 7) {
        setDuration({ value: Math.ceil(diffDays / 7), unit: 'weeks' })
      } else if (diffDays >= 1) {
        setDuration({ value: diffDays, unit: 'days' })
      } else {
        const diffHours = Math.ceil(diffMs / (1000 * 60 * 60))
        if (diffHours >= 1) {
          setDuration({ value: diffHours, unit: 'hours' })
        } else {
          setDuration({ value: Math.ceil(diffMs / (1000 * 60)), unit: 'minutes' })
        }
      }
    } else {
      setDuration({ value: 1, unit: 'days' })
    }
  }

  const calculateDueDate = () => {
    const now = new Date()
    const { value, unit } = duration
    
    switch(unit) {
      case 'minutes':
        return new Date(now.getTime() + value * 60000)
      case 'hours':
        return new Date(now.getTime() + value * 3600000)
      case 'days':
        return new Date(now.getTime() + value * 86400000)
      case 'weeks':
        return new Date(now.getTime() + value * 604800000)
      default:
        return now
    }
  }

  const handleSave = async () => {
    const newDueDate = calculateDueDate()
    const updatedTaskData = {
      ...editedTask,
      dueAt: newDueDate.toISOString()
    }
    
    await onUpdate(updatedTaskData)
    setIsEditing(false)
    toast.success('Task updated successfully')
  }

  const handleCancel = () => {
    setEditedTask({ ...task })
    setIsEditing(false)
  }

  const handleDelete = async () => {
      await onDelete(task.id)
      toast.success('Task deleted successfully')
  }

  if (isEditing) {
    return (
      <div className="task-card editing">
        <input
          type="text"
          value={editedTask.title}
          onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
          className="edit-title"
          placeholder="Title"
        />
        <textarea
          value={editedTask.description}
          onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
          className="edit-description"
          placeholder="Description"
          rows="2"
        />
        <div className="edit-duration-row">
          <input
            type="number"
            value={duration.value}
            onChange={(e) => setDuration({ ...duration, value: parseInt(e.target.value) || 1 })}
            className="edit-duration-value"
            min="1"
          />
          <select
            value={duration.unit}
            onChange={(e) => setDuration({ ...duration, unit: e.target.value })}
            className="edit-duration-unit"
          >
            <option value="minutes">Minutes</option>
            <option value="hours">Hours</option>
            <option value="days">Days</option>
            <option value="weeks">Weeks</option>
          </select>
        </div>
        <div className="edit-actions">
          <button onClick={handleSave} className="save-btn">Save</button>
          <button onClick={handleCancel} className="cancel-btn">Cancel</button>
        </div>
      </div>
    )
  }

  return (
    <div className={`task-card ${task.isCompleted ? 'completed' : ''}`}>
      <div className="task-header">
        <div className="task-title-section">
          <input
            type="checkbox"
            checked={task.isCompleted}
            onChange={handleToggleComplete}
            className="task-checkbox"
          />
          <h3 className="task-title">{task.title}</h3>
        </div>
        <div className="task-actions">
          <button onClick={handleEdit} className="action-btn edit-btn" aria-label="Edit">
            ✏️
          </button>
          <button onClick={handleDelete} className="action-btn delete-btn" aria-label="Delete">
            🗑️
          </button>
        </div>
      </div>
      
      {task.description && (
        <p className="task-description">{task.description}</p>
      )}
      
      <div className="task-footer">
        {!task.isCompleted && (
        <div className="task-due-date">
          <span className="due-icon">📅</span>
          <span>Due: {formatDistanceToNow(new Date(task.dueAt), { addSuffix: true })}</span>
        </div>
      )}
        <div 
          className="task-status" 
          style={{ backgroundColor: getStatusColor(task.status) }}
        >
          {task.status}
        </div>
      </div>
    </div>
  )
}

export default TaskCard
