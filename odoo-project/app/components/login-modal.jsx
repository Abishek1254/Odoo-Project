"use client"

import { X } from "lucide-react"

export default function LoginModal({ isOpen, onClose, onLogin, onSignup }) {
  if (!isOpen) return null

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-gray-900 border-2 border-white rounded-2xl p-8 w-full max-w-md text-center relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-400 transition-colors duration-300"
        >
          <X size={24} />
        </button>

        <h3 className="text-2xl mb-4">Login Required</h3>
        <p className="text-gray-400 mb-6">Please login to request skill exchanges.</p>

        <div className="flex gap-4 justify-center">
          <button
            onClick={onLogin}
            className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-lg transition-colors duration-300"
          >
            Login
          </button>
          <button
            onClick={onSignup}
            className="border-2 border-white text-white px-6 py-3 rounded-lg hover:bg-white hover:text-gray-900 transition-all duration-300"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  )
}
