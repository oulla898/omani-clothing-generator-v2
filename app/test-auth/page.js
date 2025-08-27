'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import { WorkingAuthProvider } from './provider'

function TestAuthContent() {
  const { data: session, status } = useSession()

  if (status === "loading") return <p>Loading...</p>

  if (session) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">✅ OAuth Working!</h1>
        <p>Signed in as {session.user.email}</p>
        <p>Name: {session.user.name}</p>
        {session.user.image && (
          <img src={session.user.image} alt="Profile" className="w-16 h-16 rounded-full mt-4" />
        )}
        <br />
        <button 
          onClick={() => signOut()} 
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
        >
          Sign out
        </button>
      </div>
    )
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test OAuth</h1>
      <p className="mb-4">Not signed in</p>
      <button 
        onClick={() => {
          // Use the working auth endpoint
          window.location.href = '/api/auth-working/signin/google'
        }}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Sign in with Google
      </button>
    </div>
  )
}

export default function TestAuth() {
  return (
    <WorkingAuthProvider>
      <TestAuthContent />
    </WorkingAuthProvider>
  )
}