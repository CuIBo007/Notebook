import React, { useState } from 'react'
import { formatDistanceToNow, format } from 'date-fns'
import toast from 'react-hot-toast'
import './TaskCard.css'

const TaskCard = ({ task, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editedTask, setEditedTask] = useState({ ...task })

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
  }

  const handleSave = async () => {
    await onUpdate(editedTask)
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
        <input
          type="datetime-local"
          value={format(new Date(editedTask.dueAt), "yyyy-MM-dd'T'HH:mm")}
          onChange={(e) => setEditedTask({ ...editedTask, dueAt: new Date(e.target.value).toISOString() })}
          className="edit-due-date"
        />
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
        <div className="task-due-date">
          <span className="due-icon">📅</span>
          <span>Due: {formatDistanceToNow(new Date(task.dueAt), { addSuffix: true })}</span>
        </div>
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
