import React from 'react'
import './Navbar.css'

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="logo">
          <span className="logo-text">Notebook</span>
        </div>
        <div className="nav-actions">
            <button className="notification-btn" aria-label="Notifications">
              🔔
            </button>
          </div>
        </div>
    </nav>
  )
}

export default Navbar
