"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function Header() {
  const [userEmail, setUserEmail] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const email = localStorage.getItem("userEmail")
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"

    if (isLoggedIn && email) {
      setUserEmail(email)
    } else {
      setUserEmail(null)
    }
  }, [])

  const handleLoginLogout = () => {
    if (userEmail) {
      // Logout
      localStorage.removeItem("isLoggedIn")
      localStorage.removeItem("userEmail")
      setUserEmail(null)
      router.push("/")
    } else {
      // Redirect to login
      router.push("/login")
    }
  }

  return (
    <header className="border-b-2 border-white pb-6 mb-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-center md:text-left">
          <h2 className="text-xl font-normal">Skill Swap Platform</h2>
        </div>

        <div className="flex items-center gap-4">
          {userEmail && (
            <span className="text-sm text-gray-300 hidden sm:inline">
              Welcome, {userEmail}
            </span>
          )}
          <button
            onClick={handleLoginLogout}
            className="border-2 border-white px-6 py-2 rounded-full hover:bg-white hover:text-gray-900 transition-all duration-300"
          >
            {userEmail ? "Logout" : "Login"}
          </button>
        </div>
      </div>
    </header>
  )
}
