"use client"

import { useState, useEffect } from "react"
import Header from "./components/header"
import SearchSection from "./components/search-section"
import UserCard from "./components/user-card"
import Pagination from "./components/pagination"
import LoginModal from "./components/login-modal"

export default function HomePage() {
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [availabilityFilter, setAvailabilityFilter] = useState("")
  const [locationFilter, setLocationFilter] = useState("")
  const [skillLevelFilter, setSkillLevelFilter] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [notification, setNotification] = useState(null)
  const [user, setUser] = useState(null)
  const [notifications, setNotifications] = useState([])

  const usersPerPage = 3

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/users')
      const data = await response.json()
      
      if (data.success) {
        setUsers(data.data.users)
        setFilteredUsers(data.data.users)
      } else {
        setError('Failed to fetch users')
      }
    } catch (err) {
      setError('Error loading users')
      console.error('Error fetching users:', err)
    } finally {
      setLoading(false)
    }
  }

  // Fetch notifications for logged-in user
  const fetchNotifications = async () => {
    if (!isLoggedIn || !user) return
    
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/notifications', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      
      if (data.success) {
        setNotifications(data.data.notifications)
      }
    } catch (err) {
      console.error('Error fetching notifications:', err)
    }
  }

  useEffect(() => {
    fetchUsers()
    
    // Check if user is already logged in
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    if (token && userData) {
      const parsedUser = JSON.parse(userData)
      setIsLoggedIn(true)
      setUser(parsedUser)
      // Fetch notifications for logged-in user
      setTimeout(() => fetchNotifications(), 1000)
    }
  }, [])

  // Auto-dismiss notifications after 5 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [notification])

  useEffect(() => {
    const filtered = users.filter((user) => {
      const matchesSearch =
        searchTerm === "" ||
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.skillsOffered.some((skill) => skill.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        user.skillsWanted.some((skill) => skill.name.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesAvailability = availabilityFilter === "" || user.availability === availabilityFilter

      const matchesLocation = locationFilter === "" || 
        (locationFilter === "remote" && user.location && user.location.toLowerCase().includes("remote")) ||
        (locationFilter === "local" && user.location && !user.location.toLowerCase().includes("remote")) ||
        (locationFilter === "hybrid" && user.location && user.location.toLowerCase().includes("hybrid"))

      const matchesSkillLevel = skillLevelFilter === "" || 
        user.skillsOffered.some((skill) => skill.level === skillLevelFilter)

      return matchesSearch && matchesAvailability && matchesLocation && matchesSkillLevel
    })

    setFilteredUsers(filtered)
    setCurrentPage(1)
  }, [users, searchTerm, availabilityFilter, locationFilter, skillLevelFilter])

  const handleSearch = (term) => {
    setSearchTerm(term)
  }

  const handleAvailabilityFilter = (availability) => {
    setAvailabilityFilter(availability)
  }

  const handleLocationFilter = (location) => {
    setLocationFilter(location)
  }

  const handleSkillLevelFilter = (level) => {
    setSkillLevelFilter(level)
  }

  const handleLogin = () => {
    if (isLoggedIn) {
      setIsLoggedIn(false)
      setUser(null)
      setNotifications([])
      // Clear localStorage
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      setNotification({
        type: 'success',
        message: 'You have been logged out successfully!',
        title: 'Logged Out'
      })
    } else {
      setShowLoginModal(true)
    }
  }

  const handleModalLogin = async (formData) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      })

      const data = await response.json()

      if (data.success) {
        setIsLoggedIn(true)
        setShowLoginModal(false)
        setUser(data.data.user)
        // Store token in localStorage
        localStorage.setItem('token', data.data.token)
        localStorage.setItem('user', JSON.stringify(data.data.user))
        setNotification({
          type: 'success',
          message: `Welcome back, ${data.data.user.name}!`,
          title: 'Login Successful'
        })
        // Refresh users list to show any updates
        fetchUsers()
        // Fetch notifications
        setTimeout(() => fetchNotifications(), 1000)
      } else {
        setNotification({
          type: 'error',
          message: data.message || 'Login failed',
          title: 'Login Error'
        })
      }
    } catch (error) {
      console.error('Login error:', error)
      setNotification({
        type: 'error',
        message: 'Login failed. Please try again.',
        title: 'Login Error'
      })
    }
  }

  const handleModalSignup = async (formData) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          location: formData.location || ''
        })
      })

      const data = await response.json()

      if (data.success) {
        setIsLoggedIn(true)
        setShowLoginModal(false)
        setUser(data.data.user)
        // Store token in localStorage
        localStorage.setItem('token', data.data.token)
        localStorage.setItem('user', JSON.stringify(data.data.user))
        setNotification({
          type: 'success',
          message: `Account created successfully for ${data.data.user.name}!`,
          title: 'Registration Successful'
        })
        // Refresh users list to show the new user
        fetchUsers()
        // Fetch notifications
        setTimeout(() => fetchNotifications(), 1000)
      } else {
        setNotification({
          type: 'error',
          message: data.message || 'Registration failed',
          title: 'Registration Error'
        })
      }
    } catch (error) {
      console.error('Registration error:', error)
      setNotification({
        type: 'error',
        message: 'Registration failed. Please try again.',
        title: 'Registration Error'
      })
    }
  }

  const handleRequest = async (recipientId) => {
    if (!isLoggedIn) {
      setShowLoginModal(true)
      return
    }

    const recipient = users.find((u) => u._id === recipientId)
    if (!recipient) {
      setNotification({
        type: 'error',
        message: 'User not found',
        title: 'Error'
      })
      return
    }

    // Find a skill that the current user can offer and the recipient wants
    const userSkillsOffered = user?.skillsOffered || []
    const recipientSkillsWanted = recipient.skillsWanted || []
    
    // Find a matching skill
    let matchingSkill = userSkillsOffered.find(skill => 
      recipientSkillsWanted.some(wanted => wanted.name === skill.name)
    )
    // Fallback: pick first offered skill
    if (!matchingSkill && userSkillsOffered.length > 0) {
      matchingSkill = userSkillsOffered[0]
    }

    // Find a skill that the recipient offers and the current user wants
    const recipientSkillsOffered = recipient.skillsOffered || []
    const userSkillsWanted = user?.skillsWanted || []
    
    let requestedSkill = recipientSkillsOffered.find(skill => 
      userSkillsWanted.some(wanted => wanted.name === skill.name)
    )
    // Fallback: pick first recipient offered skill
    if (!requestedSkill && recipientSkillsOffered.length > 0) {
      requestedSkill = recipientSkillsOffered[0]
    }

    if (!matchingSkill || !requestedSkill) {
      setNotification({
        type: 'error',
        message: 'No skills available for swap',
        title: 'No Skills'
      })
      return
    }

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/swaps', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          recipientId,
          requestedSkill: {
            name: requestedSkill.name,
            description: requestedSkill.description
          },
          offeredSkill: {
            name: matchingSkill.name,
            description: matchingSkill.description
          },
          message: `I can help you with ${matchingSkill.name} in exchange for ${requestedSkill.name}`
        })
      })

      const data = await response.json()

      if (data.success) {
        setNotification({
          type: 'success',
          message: `Swap request sent to ${recipient.name}! They'll review your offer soon.`,
          title: 'Request Sent'
        })
        // Refresh notifications
        fetchNotifications()
      } else {
        setNotification({
          type: 'error',
          message: data.message || 'Failed to send swap request',
          title: 'Error'
        })
      }
    } catch (error) {
      console.error('Swap request error:', error)
      setNotification({
        type: 'error',
        message: 'Failed to send swap request',
        title: 'Error'
      })
    }
  }

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage)
  const startIndex = (currentPage - 1) * usersPerPage
  const endIndex = startIndex + usersPerPage
  const currentUsers = filteredUsers.slice(startIndex, endIndex)

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Header 
          isLoggedIn={isLoggedIn} 
          onLogin={handleLogin} 
          user={user}
          notifications={notifications}
        />

        {/* Notification Toast */}
        {notification && (
          <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm transition-all duration-300 ${
            notification.type === 'success' 
              ? 'bg-green-600 text-white' 
              : 'bg-red-600 text-white'
          }`}>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                {notification.type === 'success' ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <h4 className="font-medium">{notification.title}</h4>
                <p className="text-sm opacity-90">{notification.message}</p>
              </div>
              <button
                onClick={() => setNotification(null)}
                className="flex-shrink-0 text-white/70 hover:text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Find Your Perfect Skill Match
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Connect with talented individuals, exchange skills, and grow together. 
            Whether you're a developer, designer, or creative professional, find your next collaboration here.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-8 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-cyan-500/25">
              Start Swapping Skills
            </button>
            <button className="border border-gray-600 text-gray-300 hover:border-cyan-400 hover:text-cyan-400 px-8 py-3 rounded-xl transition-all duration-200">
              Learn How It Works
            </button>
          </div>
        </div>

        <SearchSection
          onSearch={handleSearch}
          onAvailabilityFilter={handleAvailabilityFilter}
          onLocationFilter={handleLocationFilter}
          onSkillLevelFilter={handleSkillLevelFilter}
          searchTerm={searchTerm}
          availabilityFilter={availabilityFilter}
          locationFilter={locationFilter}
          skillLevelFilter={skillLevelFilter}
        />

        {/* Results Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <div className="text-left mb-4 sm:mb-0">
            <h2 className="text-2xl font-semibold text-white">
              Available Skill Swappers
            </h2>
            <p className="text-gray-400">
              {filteredUsers.length} {filteredUsers.length === 1 ? 'person' : 'people'} found
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <select className="bg-gray-800 border border-gray-600 text-white px-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500">
              <option value="recent">Most Recent</option>
              <option value="rating">Highest Rated</option>
              <option value="swaps">Most Swaps</option>
              <option value="available">Available Now</option>
            </select>
          </div>
        </div>

        {/* Users Grid */}
        <div className="space-y-6 mb-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Loading users...</h3>
              <p className="text-gray-400">Please wait while we fetch the latest skill swappers</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">⚠️</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Error loading users</h3>
              <p className="text-gray-400 mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 rounded-lg transition-colors duration-200"
              >
                Try Again
              </button>
            </div>
          ) : currentUsers.length > 0 ? (
            currentUsers.map((user) => (
              <UserCard key={user._id} user={user} onRequest={handleRequest} />
            ))
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">🔍</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No matches found</h3>
              <p className="text-gray-400 mb-4">
                Try adjusting your search criteria or filters
              </p>
              <button 
                onClick={() => {
                  setSearchTerm("")
                  setAvailabilityFilter("")
                  setLocationFilter("")
                  setSkillLevelFilter("")
                }}
                className="text-cyan-400 hover:text-cyan-300 transition-colors duration-200"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        )}

        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onLogin={handleModalLogin}
          onSignup={handleModalSignup}
        />
      </div>
    </div>
  )
}
