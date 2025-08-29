import React from 'react'
import { Link } from 'react-router-dom'
export default function NotFound(){
  return <div className="container center">
    <h2>404 — Page not found</h2>
    <p><Link to="/">Go Home</Link></p>
  </div>
}
