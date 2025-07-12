"use client"

import { useState } from "react"
import { Menu, X, User, Bell, Search, Plus, Settings, LogOut, MessageSquare, Star } from "lucide-react"

export default function Header({ isLoggedIn, onLogin }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)

  const notifications = [
    {
      id: 1,
      type: 'swap_request',
      message: 'Sarah Johnson accepted your skill swap request',
      time: '2 minutes ago',
      read: false
    },
    {
      id: 2,
      type: 'new_message',
      message: 'New message from Joe Williams',
      time: '1 hour ago',
      read: false
    },
    {
      id: 3,
      type: 'rating',
      message: 'You received a 5-star rating from Michelle Chen',
      time: '3 hours ago',
      read: true
    }
  ]

  const unreadCount = notifications.filter(n => !n.read).length

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications)
    setShowProfileMenu(false)
  }

  const handleProfileClick = () => {
    setShowProfileMenu(!showProfileMenu)
    setShowNotifications(false)
  }

  const handleLogout = () => {
    onLogin()
    setShowProfileMenu(false)
  }

  return (
    <header className="bg-gray-900 border-b border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">SS</span>
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                    SkillSwap
                  </h1>
                  <p className="text-xs text-gray-400">Exchange Skills, Grow Together</p>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-300 hover:text-cyan-400 transition-colors duration-200">
              Browse Skills
            </a>
            <a href="#" className="text-gray-300 hover:text-cyan-400 transition-colors duration-200">
              How It Works
            </a>
            <a href="#" className="text-gray-300 hover:text-cyan-400 transition-colors duration-200">
              Success Stories
            </a>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                {/* Notifications */}
                <div className="relative">
                  <button 
                    onClick={handleNotificationClick}
                    className="p-2 text-gray-400 hover:text-cyan-400 transition-colors duration-200 relative"
                  >
                    <Bell size={20} />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center font-medium">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notifications Dropdown */}
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50">
                      <div className="p-4 border-b border-gray-700">
                        <h3 className="text-white font-semibold">Notifications</h3>
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {notifications.length > 0 ? (
                          notifications.map((notification) => (
                            <div 
                              key={notification.id} 
                              className={`p-4 border-b border-gray-700 hover:bg-gray-700 transition-colors duration-200 ${
                                !notification.read ? 'bg-blue-500/10' : ''
                              }`}
                            >
                              <div className="flex items-start space-x-3">
                                <div className="flex-shrink-0">
                                  {notification.type === 'swap_request' && (
                                    <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                                      <Star className="w-4 h-4 text-green-400" />
                                    </div>
                                  )}
                                  {notification.type === 'new_message' && (
                                    <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                                      <MessageSquare className="w-4 h-4 text-blue-400" />
                                    </div>
                                  )}
                                  {notification.type === 'rating' && (
                                    <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center">
                                      <Star className="w-4 h-4 text-yellow-400" />
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm text-white">{notification.message}</p>
                                  <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                                </div>
                                {!notification.read && (
                                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                )}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="p-4 text-center text-gray-400">
                            No notifications yet
                          </div>
                        )}
                      </div>
                      <div className="p-4 border-t border-gray-700">
                        <button className="text-cyan-400 hover:text-cyan-300 text-sm transition-colors duration-200">
                          Mark all as read
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile Menu */}
                <div className="relative">
                  <button 
                    onClick={handleProfileClick}
                    className="p-2 text-gray-400 hover:text-cyan-400 transition-colors duration-200"
                  >
                    <User size={20} />
                  </button>

                  {/* Profile Dropdown */}
                  {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50">
                      <div className="p-4 border-b border-gray-700">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-sm">U</span>
                          </div>
                          <div>
                            <p className="text-white font-medium">User Name</p>
                            <p className="text-gray-400 text-sm">user@example.com</p>
                          </div>
                        </div>
                      </div>
                      <div className="py-2">
                        <button className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200 flex items-center space-x-2">
                          <User className="w-4 h-4" />
                          <span>My Profile</span>
                        </button>
                        <button className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200 flex items-center space-x-2">
                          <Settings className="w-4 h-4" />
                          <span>Settings</span>
                        </button>
                        <button className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200 flex items-center space-x-2">
                          <MessageSquare className="w-4 h-4" />
                          <span>My Swaps</span>
                        </button>
                        <div className="border-t border-gray-700 my-2"></div>
                        <button 
                          onClick={handleLogout}
                          className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-gray-700 hover:text-red-300 transition-colors duration-200 flex items-center space-x-2"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2">
                  <Plus size={16} />
                  <span>Add Skill</span>
                </button>
              </>
            ) : (
              <button
                onClick={onLogin}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-6 py-2 rounded-lg transition-all duration-200 font-medium"
              >
                Get Started
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-400 hover:text-white transition-colors duration-200"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-700 py-4">
            <div className="flex flex-col space-y-4">
              <a href="#" className="text-gray-300 hover:text-cyan-400 transition-colors duration-200">
                Browse Skills
              </a>
              <a href="#" className="text-gray-300 hover:text-cyan-400 transition-colors duration-200">
                How It Works
              </a>
              <a href="#" className="text-gray-300 hover:text-cyan-400 transition-colors duration-200">
                Success Stories
              </a>
              {isLoggedIn ? (
                <div className="flex flex-col space-y-2 pt-4 border-t border-gray-700">
                  <button className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2">
                    <Plus size={16} />
                    <span>Add Skill</span>
                  </button>
                  <button
                    onClick={onLogin}
                    className="border border-gray-600 text-gray-300 hover:border-cyan-400 hover:text-cyan-400 px-4 py-2 rounded-lg transition-all duration-200"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={onLogin}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-2 rounded-lg transition-all duration-200 font-medium"
                >
                  Get Started
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Click outside to close dropdowns */}
      {(showNotifications || showProfileMenu) && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => {
            setShowNotifications(false)
            setShowProfileMenu(false)
          }}
        />
      )}
    </header>
  )
}
