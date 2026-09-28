import React from 'react'

export default function Dashboard({ currentUser, tasks }) {
  return (
    <div>
      <h2>Dashboard Placeholder</h2>
      <p>Welcome, {currentUser?.name}</p>
      <p>Loaded tasks: {tasks.length}</p>
    </div>
  )
}