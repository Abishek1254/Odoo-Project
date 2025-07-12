"use client"

import { useState } from "react"
import { Star, MapPin, Clock, MessageCircle, Heart, Share2, MoreVertical, CheckCircle, XCircle } from "lucide-react"

export default function UserCard({ user, onRequest }) {
  const [isLiked, setIsLiked] = useState(false)
  const [showActions, setShowActions] = useState(false)

  const getAvailabilityColor = (status) => {
    switch (status) {
      case 'available': return 'text-green-400'
      case 'busy': return 'text-yellow-400'
      case 'offline': return 'text-gray-400'
      default: return 'text-gray-400'
    }
  }

  const getAvailabilityIcon = (status) => {
    switch (status) {
      case 'available': return <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
      case 'busy': return <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
      case 'offline': return <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
      default: return <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
    }
  }

  const renderStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)
    }
    
    if (hasHalfStar) {
      stars.push(<Star key="half" className="w-4 h-4 fill-yellow-400 text-yellow-400" />)
    }

    const emptyStars = 5 - Math.ceil(rating)
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-600" />)
    }

    return stars
  }

  return (
    <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 hover:border-cyan-500/50 transition-all duration-300 group relative">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Profile Section */}
        <div className="flex-shrink-0">
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="absolute -bottom-1 -right-1">
              {getAvailabilityIcon(user.availability)}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="text-xl font-semibold text-white truncate">{user.name}</h3>
                {user.isVerified && (
                  <CheckCircle className="w-5 h-5 text-cyan-400" />
                )}
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>{user.location || 'Location not specified'}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span className={getAvailabilityColor(user.availability)}>
                    {user.availability.charAt(0).toUpperCase() + user.availability.slice(1)}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  isLiked 
                    ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
                    : 'text-gray-400 hover:text-red-400 hover:bg-gray-700'
                }`}
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              </button>
              <button className="p-2 text-gray-400 hover:text-cyan-400 hover:bg-gray-700 rounded-lg transition-all duration-200">
                <Share2 className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setShowActions(!showActions)}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-all duration-200"
              >
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center space-x-2 mb-4">
            <div className="flex items-center space-x-1">
              {renderStars(user.rating?.average || 0)}
            </div>
            <span className="text-sm text-gray-400">({(user.rating?.average || 0).toFixed(1)})</span>
            <span className="text-sm text-gray-500">•</span>
            <span className="text-sm text-gray-400">{user.rating?.count || 0} reviews</span>
          </div>

          {/* Skills Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Skills Offered */}
            <div>
              <h4 className="text-sm font-medium text-cyan-400 mb-2 flex items-center">
                <CheckCircle className="w-4 h-4 mr-1" />
                Skills Offered
              </h4>
              <div className="flex flex-wrap gap-2">
                {user.skillsOffered?.map((skill, index) => (
                  <span 
                    key={index} 
                    className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-xs font-medium border border-cyan-500/30"
                    title={`${skill.name} - ${skill.level}`}
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Skills Wanted */}
            <div>
              <h4 className="text-sm font-medium text-blue-400 mb-2 flex items-center">
                <XCircle className="w-4 h-4 mr-1" />
                Skills Wanted
              </h4>
              <div className="flex flex-wrap gap-2">
                {user.skillsWanted?.map((skill, index) => (
                  <span 
                    key={index} 
                    className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-medium border border-blue-500/30"
                    title={`${skill.name} - ${skill.priority} priority`}
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col space-y-3 lg:flex-shrink-0">
          <button
            onClick={() => onRequest(user._id)}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-cyan-500/25"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Request Swap</span>
          </button>
          
          <div className="text-center">
            <div className="text-sm text-gray-400">Completed Swaps</div>
            <div className="text-lg font-semibold text-white">{user.totalSwaps?.completed || 0}</div>
          </div>
        </div>
      </div>

      {/* Dropdown Actions */}
      {showActions && (
        <div className="absolute top-4 right-4 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-10">
          <div className="py-2">
            <button className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors duration-200">
              View Profile
            </button>
            <button className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors duration-200">
              Report User
            </button>
            <button className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors duration-200">
              Block User
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
