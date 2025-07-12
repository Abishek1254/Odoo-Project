"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Header from "./components/header"
import SearchSection from "./components/search-section"
import UserCard from "./components/user-card"
import Pagination from "./components/pagination"
import LoginModal from "./components/login-modal"

const users = [
  {
    id: 1,
    name: "Marc Demo",
    skillsOffered: ["Java Script", "Python"],
    skillsWanted: ["ReactJS", "Graphic designer"],
    rating: "3.4/5",
    availability: "available",
  },
  {
    id: 2,
    name: "Michell",
    skillsOffered: ["Java Script", "Python"],
    skillsWanted: ["ReactJS", "Graphic designer"],
    rating: "2.5/5",
    availability: "available",
  },
  {
    id: 3,
    name: "Joe Wills",
    skillsOffered: ["Java Script", "Python"],
    skillsWanted: ["ReactJS", "Graphic designer"],
    rating: "4.0/5",
    availability: "busy",
  },
  {
    id: 4,
    name: "Sarah Chen",
    skillsOffered: ["React", "Node.js"],
    skillsWanted: ["Python", "Machine Learning"],
    rating: "4.8/5",
    availability: "available",
  },
  {
    id: 5,
    name: "Alex Johnson",
    skillsOffered: ["UI/UX Design", "Figma"],
    skillsWanted: ["Frontend Development", "Vue.js"],
    rating: "4.2/5",
    availability: "offline",
  },
]

export default function HomePage() {
  const router = useRouter()

  const [filteredUsers, setFilteredUsers] = useState(users)
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [availabilityFilter, setAvailabilityFilter] = useState("")

  const usersPerPage = 3

  useEffect(() => {
    const filtered = users.filter((user) => {
      const matchesSearch =
        searchTerm === "" ||
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.skillsOffered.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
        user.skillsWanted.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesAvailability = availabilityFilter === "" || user.availability === availabilityFilter

      return matchesSearch && matchesAvailability
    })

    setFilteredUsers(filtered)
    setCurrentPage(1)
  }, [searchTerm, availabilityFilter])

  const handleSearch = (term) => {
    setSearchTerm(term)
  }

  const handleAvailabilityFilter = (availability) => {
    setAvailabilityFilter(availability)
  }

  const handleLogin = () => {
    if (isLoggedIn) {
      setIsLoggedIn(false)
      router.push("/") // You can remove this line if logout doesn't need routing
    } else {
      setShowLoginModal(true)
    }
  }

  const handleModalLogin = () => {
    setShowLoginModal(false)
    router.push("/login") // ✅ Route to /login on login button
  }

  const handleModalSignup = () => {
    setShowLoginModal(false)
    router.push("/signup") // ✅ Route to /signup on signup button
  }

  const handleRequest = (userId) => {
    if (!isLoggedIn) {
      setShowLoginModal(true)
      return
    }

    const user = users.find((u) => u.id === userId)
    console.log(`Request sent to ${user?.name}`)
  }

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage)
  const startIndex = (currentPage - 1) * usersPerPage
  const endIndex = startIndex + usersPerPage
  const currentUsers = filteredUsers.slice(startIndex, endIndex)

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <Header isLoggedIn={isLoggedIn} onLogin={handleLogin} />

        <SearchSection
          onSearch={handleSearch}
          onAvailabilityFilter={handleAvailabilityFilter}
          searchTerm={searchTerm}
          availabilityFilter={availabilityFilter}
        />

        <div className="space-y-6 mb-8">
          {currentUsers.map((user) => (
            <UserCard key={user.id} user={user} onRequest={handleRequest} />
          ))}
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
