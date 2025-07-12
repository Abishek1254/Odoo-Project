"use client"

import { useState, useEffect } from "react"
import Header from "./components/header"
import SearchSection from "./components/search-section"
import UserCard from "./components/user-card"
import Pagination from "./components/pagination"
import LoginModal from "./components/login-modal"

const users = [
  {
    id: 1,
    name: "Marc Demo",
    skillsOffered: ["JavaScript", "Python", "React", "Node.js"],
    skillsWanted: ["UI/UX Design", "Graphic Design", "Figma"],
    rating: "4.2",
    availability: "available",
    isVerified: true,
    location: "San Francisco, CA",
    completedSwaps: 24,
    reviews: 15
  },
  {
    id: 2,
    name: "Michelle Chen",
    skillsOffered: ["UI/UX Design", "Figma", "Adobe Creative Suite"],
    skillsWanted: ["React", "JavaScript", "Frontend Development"],
    rating: "4.8",
    availability: "available",
    isVerified: true,
    location: "New York, NY",
    completedSwaps: 31,
    reviews: 22
  },
  {
    id: 3,
    name: "Joe Williams",
    skillsOffered: ["Machine Learning", "Python", "Data Science"],
    skillsWanted: ["Web Development", "JavaScript", "React"],
    rating: "4.0",
    availability: "busy",
    isVerified: false,
    location: "Austin, TX",
    completedSwaps: 18,
    reviews: 12
  },
  {
    id: 4,
    name: "Sarah Johnson",
    skillsOffered: ["Content Writing", "SEO", "Digital Marketing"],
    skillsWanted: ["Python", "Data Analysis", "Excel"],
    rating: "4.6",
    availability: "available",
    isVerified: true,
    location: "Chicago, IL",
    completedSwaps: 27,
    reviews: 19
  },
  {
    id: 5,
    name: "Alex Rodriguez",
    skillsOffered: ["Mobile Development", "Swift", "React Native"],
    skillsWanted: ["Backend Development", "Node.js", "Database Design"],
    rating: "4.4",
    availability: "offline",
    isVerified: true,
    location: "Miami, FL",
    completedSwaps: 21,
    reviews: 16
  },
  {
    id: 6,
    name: "Emma Thompson",
    skillsOffered: ["Photography", "Video Editing", "Adobe Premiere"],
    skillsWanted: ["Social Media Marketing", "Content Strategy"],
    rating: "4.7",
    availability: "available",
    isVerified: false,
    location: "Los Angeles, CA",
    completedSwaps: 29,
    reviews: 20
  }
]

export default function HomePage() {
  const [filteredUsers, setFilteredUsers] = useState(users)
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [availabilityFilter, setAvailabilityFilter] = useState("")
  const [locationFilter, setLocationFilter] = useState("")
  const [skillLevelFilter, setSkillLevelFilter] = useState("")

  const usersPerPage = 3

  useEffect(() => {
    const filtered = users.filter((user) => {
      const matchesSearch =
        searchTerm === "" ||
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.skillsOffered.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
        user.skillsWanted.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesAvailability = availabilityFilter === "" || user.availability === availabilityFilter

      const matchesLocation = locationFilter === "" || 
        (locationFilter === "remote" && user.location.includes("Remote")) ||
        (locationFilter === "local" && !user.location.includes("Remote")) ||
        (locationFilter === "hybrid" && user.location.includes("Hybrid"))

      return matchesSearch && matchesAvailability && matchesLocation
    })

    setFilteredUsers(filtered)
    setCurrentPage(1)
  }, [searchTerm, availabilityFilter, locationFilter, skillLevelFilter])

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
      alert("Logged out successfully!")
    } else {
      setShowLoginModal(true)
    }
  }

  const handleModalLogin = (formData) => {
    setIsLoggedIn(true)
    setShowLoginModal(false)
    alert(`Welcome back, ${formData.email}!`)
  }

  const handleModalSignup = (formData) => {
    setIsLoggedIn(true)
    setShowLoginModal(false)
    alert(`Account created successfully for ${formData.name}!`)
  }

  const handleRequest = (userId) => {
    if (!isLoggedIn) {
      setShowLoginModal(true)
      return
    }

    const user = users.find((u) => u.id === userId)
    alert(`Swap request sent to ${user?.name}! They'll review your offer soon.`)
  }

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage)
  const startIndex = (currentPage - 1) * usersPerPage
  const endIndex = startIndex + usersPerPage
  const currentUsers = filteredUsers.slice(startIndex, endIndex)

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Header isLoggedIn={isLoggedIn} onLogin={handleLogin} />

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
          {currentUsers.length > 0 ? (
            currentUsers.map((user) => (
              <UserCard key={user.id} user={user} onRequest={handleRequest} />
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
