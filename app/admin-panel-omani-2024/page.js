'use client'

import { useState, useEffect } from 'react'
import { useSession, signIn } from 'next-auth/react'

export default function AdminPanel() {
  const { data: session, status } = useSession()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [error, setError] = useState('')

  // Password check
  const handlePasswordSubmit = (e) => {
    e.preventDefault()
    if (password === '112233') {
      setIsAuthenticated(true)
      setError('')
      fetchUsers()
    } else {
      setError('Incorrect password')
    }
  }

  // Fetch all users
  const fetchUsers = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/users')
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users)
      } else {
        setError('Failed to fetch users')
      }
    } catch (error) {
      setError('Error fetching users')
    } finally {
      setLoading(false)
    }
  }

  // Update user credits
  const updateCredits = async (userId, newCredits) => {
    try {
      const response = await fetch('/api/admin/update-credits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, credits: newCredits })
      })
      
      if (response.ok) {
        fetchUsers() // Refresh the list
      } else {
        setError('Failed to update credits')
      }
    } catch (error) {
      setError('Error updating credits')
    }
  }

  // Filter users based on search
  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  // Calculate statistics
  const totalUsers = users.length
  const totalCredits = users.reduce((sum, user) => sum + user.credits, 0)
  const usersWithZeroCredits = users.filter(user => user.credits === 0).length

  // Show login if not authenticated with Google
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full">
          <h1 className="text-2xl font-bold text-center mb-8">Admin Access Required</h1>
          <p className="text-center text-gray-600 mb-6">Please sign in with Google first</p>
          <button
            onClick={() => signIn('google')}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700"
          >
            Sign in with Google
          </button>
        </div>
      </div>
    )
  }

  // Show password form if not authenticated to admin
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-center mb-6">🔐 Admin Panel Access</h1>
          <form onSubmit={handlePasswordSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter Admin Password:
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter password"
                required
              />
            </div>
            {error && (
              <div className="text-red-600 text-sm mb-4">{error}</div>
            )}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            >
              Access Admin Panel
            </button>
          </form>
        </div>
      </div>
    )
  }

  // Main admin panel
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🔧 Admin Panel</h1>
          <p className="text-gray-600">Manage users and credits for Omani Traditional Clothing Generator</p>
          <p className="text-sm text-gray-500 mt-2">Logged in as: {session.user.email}</p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-2xl font-bold text-blue-600">{totalUsers}</div>
            <div className="text-sm text-gray-600">Total Users</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-2xl font-bold text-green-600">{totalCredits}</div>
            <div className="text-sm text-gray-600">Total Credits</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-2xl font-bold text-red-600">{usersWithZeroCredits}</div>
            <div className="text-sm text-gray-600">Users with 0 Credits</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-2xl font-bold text-purple-600">{users.reduce((sum, user) => sum + user._count?.generations || 0, 0)}</div>
            <div className="text-sm text-gray-600">Total Generations</div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center">
            <input
              type="text"
              placeholder="Search users by email or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={fetchUsers}
              className="ml-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">User Management</h2>
          </div>
          
          {loading ? (
            <div className="p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading users...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credits</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Generations</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className={user.credits === 0 ? 'bg-red-50' : ''}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {user.image && (
                            <img className="h-8 w-8 rounded-full mr-3" src={user.image} alt="" />
                          )}
                          <div>
                            <div className="text-sm font-medium text-gray-900">{user.name || 'No name'}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.credits === 0 ? 'bg-red-100 text-red-800' :
                          user.credits <= 3 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {user.credits} credits
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user._count?.generations || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => updateCredits(user.id, user.credits + 5)}
                          className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700"
                        >
                          +5
                        </button>
                        <button
                          onClick={() => updateCredits(user.id, Math.max(0, user.credits - 1))}
                          className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700"
                        >
                          -1
                        </button>
                        <button
                          onClick={() => {
                            const newCredits = prompt(`Set credits for ${user.email}:`, user.credits)
                            if (newCredits !== null && !isNaN(newCredits)) {
                              updateCredits(user.id, parseInt(newCredits))
                            }
                          }}
                          className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700"
                        >
                          Set
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredUsers.length === 0 && (
                <div className="p-6 text-center text-gray-500">
                  {searchTerm ? 'No users found matching your search.' : 'No users found.'}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}