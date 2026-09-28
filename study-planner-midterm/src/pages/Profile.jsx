import React from 'react'

export default function Profile({ currentUser }) {
  return (
    <div>
      <h2>Profile Placeholder</h2>
      <p>User: {currentUser?.name}</p>
      <p>Role: {currentUser?.role}</p>
    </div>
  )
}