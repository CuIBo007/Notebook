import React, { useState } from 'react'
import toast from 'react-hot-toast'
import './TaskForm.css'

const TaskForm = ({ onSubmit, initialData = null, isEditing = false }) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    duration: {
      value: 1,
      unit: 'days'
    }
  })

  const [errors, setErrors] = useState({})

  const units = [
    { value: 'minutes', label: 'Minutes' },
    { value: 'hours', label: 'Hours' },
    { value: 'days', label: 'Days' },
    { value: 'weeks', label: 'Weeks' }
  ]

  const calculateDueDate = () => {
    const now = new Date()
    const { value, unit } = formData.duration
    
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

  const validateForm = () => {
    const newErrors = {}
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }
    if (formData.title.length > 200) {
      newErrors.title = 'Title must be less than 200 characters'
    }
    if (formData.duration.value <= 0) {
      newErrors.duration = 'Duration must be positive'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validateForm()) return

    const dueAt = calculateDueDate()
    const taskData = {
      title: formData.title,
      description: formData.description,
      dueAt: dueAt.toISOString()
    }

    onSubmit(taskData)
    if (!isEditing) {
      setFormData({
        title: '',
        description: '',
        duration: { value: 1, unit: 'days' }
      })
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === 'durationValue') {
      setFormData({
        ...formData,
        duration: { ...formData.duration, value: parseInt(value) || 0 }
      })
    } else if (name === 'durationUnit') {
      setFormData({
        ...formData,
        duration: { ...formData.duration, unit: value }
      })
    } else {
      setFormData({ ...formData, [name]: value })
    }
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' })
    }
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="title">Title *</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="What needs to be done?"
          className={errors.title ? 'error' : ''}
        />
        {errors.title && <span className="error-message">{errors.title}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="3"
          placeholder="Add details..."
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="durationValue">Duration</label>
          <input
            type="number"
            id="durationValue"
            name="durationValue"
            value={formData.duration.value}
            onChange={handleChange}
            min="1"
            className={errors.duration ? 'error' : ''}
          />
        </div>

        <div className="form-group">
          <label htmlFor="durationUnit">Unit</label>
          <select
            id="durationUnit"
            name="durationUnit"
            value={formData.duration.unit}
            onChange={handleChange}
          >
            {units.map(unit => (
              <option key={unit.value} value={unit.value}>
                {unit.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      {errors.duration && <span className="error-message">{errors.duration}</span>}

      <button type="submit" className="submit-btn">
        {isEditing ? 'Update Task' : 'Add Task'}
      </button>
    </form>
  )
}

export default TaskForm
