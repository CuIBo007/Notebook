import React from 'react'
import { NavLink } from 'react-router-dom'
import './Sidebar.css'

const Sidebar = () => {
  const menuItems = [
    { path: '/', label: 'Home' },
    { path: '/completed', label: 'Completed Tasks' },
    { path: '/overdue', label: 'Overdue Tasks' }
  ]

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {menuItems.map(item => (
          <NavLink 
            key={item.path} 
            to={item.path} 
            className={({ isActive }) => 
              `sidebar-link ${isActive ? 'active' : ''}` 
            }
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
