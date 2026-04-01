import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Home from './pages/Home'
import Completed from './pages/Completed'
import Overdue from './pages/Overdue'
import './App.css'

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <div className="main-layout">
          <Sidebar />
          <main className="content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/completed" element={<Completed />} />
              <Route path="/overdue" element={<Overdue />} />
            </Routes>
          </main>
        </div>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#2c1810',
              color: '#f5f0e6',
              fontFamily: "'Patrick Hand', cursive",
            },
          }}
        />
      </div>
    </Router>
  )
}

export default App
