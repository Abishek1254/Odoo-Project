"use client"

import { useState } from "react"
import { X, Mail, Lock, User, Eye, EyeOff, Github, Twitter } from "lucide-react"

export default function LoginModal({ isOpen, onClose, onLogin, onSignup }) {
  const [isSignup, setIsSignup] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({})

  if (!isOpen) return null

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (isSignup && !formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    if (isSignup && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (validateForm()) {
      if (isSignup) {
        onSignup(formData)
      } else {
        onLogin(formData)
      }
    }
  }

  const handleQuickAction = () => {
    if (isSignup) {
      onSignup(formData)
    } else {
      onLogin(formData)
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8 w-full max-w-md text-center relative shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-200 p-2 hover:bg-gray-800 rounded-lg"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">SS</span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">
            {isSignup ? 'Create Account' : 'Welcome Back'}
          </h3>
          <p className="text-gray-400">
            {isSignup 
              ? 'Join our community and start swapping skills' 
              : 'Sign in to continue your skill exchange journey'
            }
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignup && (
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Full Name"
                  className={`w-full pl-12 pr-4 py-3 bg-gray-800 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-200 ${
                    errors.name ? 'border-red-500' : 'border-gray-600'
                  }`}
                />
              </div>
              {errors.name && (
                <p className="text-red-400 text-sm mt-1 text-left">{errors.name}</p>
              )}
            </div>
          )}

          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email Address"
                className={`w-full pl-12 pr-4 py-3 bg-gray-800 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-200 ${
                  errors.email ? 'border-red-500' : 'border-gray-600'
                }`}
              />
            </div>
            {errors.email && (
              <p className="text-red-400 text-sm mt-1 text-left">{errors.email}</p>
            )}
          </div>

          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Password"
                className={`w-full pl-12 pr-12 py-3 bg-gray-800 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-200 ${
                  errors.password ? 'border-red-500' : 'border-gray-600'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition-colors duration-200"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-400 text-sm mt-1 text-left">{errors.password}</p>
            )}
          </div>

          {isSignup && (
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm Password"
                  className={`w-full pl-12 pr-4 py-3 bg-gray-800 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-200 ${
                    errors.confirmPassword ? 'border-red-500' : 'border-gray-600'
                  }`}
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-red-400 text-sm mt-1 text-left">{errors.confirmPassword}</p>
              )}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-cyan-500/25"
          >
            {isSignup ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        {/* Quick Action Button */}
        <button
          onClick={handleQuickAction}
          className="w-full mt-4 border border-gray-600 text-gray-300 hover:border-cyan-400 hover:text-cyan-400 py-3 rounded-xl transition-all duration-200"
        >
          {isSignup ? 'Sign Up with Demo' : 'Login with Demo'}
        </button>

        {/* Social Login */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-900 text-gray-400">Or continue with</span>
            </div>
          </div>
          <div className="mt-4 flex space-x-3">
            <button className="flex-1 flex items-center justify-center px-4 py-2 border border-gray-600 rounded-lg text-gray-300 hover:border-gray-500 hover:text-white transition-all duration-200">
              <Github className="h-5 w-5 mr-2" />
              GitHub
            </button>
            <button className="flex-1 flex items-center justify-center px-4 py-2 border border-gray-600 rounded-lg text-gray-300 hover:border-gray-500 hover:text-white transition-all duration-200">
              <Twitter className="h-5 w-5 mr-2" />
              Twitter
            </button>
          </div>
        </div>

        {/* Toggle Mode */}
        <div className="mt-6 text-center">
          <p className="text-gray-400">
            {isSignup ? 'Already have an account?' : "Don't have an account?"}
            <button
              onClick={() => {
                setIsSignup(!isSignup)
                setFormData({ name: '', email: '', password: '', confirmPassword: '' })
                setErrors({})
              }}
              className="ml-1 text-cyan-400 hover:text-cyan-300 transition-colors duration-200"
            >
              {isSignup ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
