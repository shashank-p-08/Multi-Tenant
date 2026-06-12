import React from 'react'
import Login from './pages/Login'
// import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import { Routes, Route } from 'react-router-dom'
import './App.css'

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        {/* <Route path="/register" element={<Register />} /> */}
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </>
  )
}

export default App
