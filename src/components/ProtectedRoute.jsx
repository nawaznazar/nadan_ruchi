import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function ProtectedRoute({ role = 'customer', children }) {
  const { user } = useAuth()
  
  // Redirect to login if user is not authenticated
  if (!user) return <Navigate to="/login" replace />
  
  // Redirect to home page if user doesn't have the required role
  if (role && user.role !== role) return <Navigate to="/" replace />
  
  // Render the protected content if all checks pass
  return children
}