"use client"

import { Search, Filter, MapPin, Clock } from "lucide-react"

export default function SearchSection({ onSearch, onAvailabilityFilter, onLocationFilter, onSkillLevelFilter, searchTerm, availabilityFilter, locationFilter, skillLevelFilter }) {
  const handleSearchSubmit = (e) => {
    e.preventDefault()
  }

  return (
    <div className="bg-gray-800 rounded-2xl p-6 mb-8 border border-gray-700">
      <div className="space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <form onSubmit={handleSearchSubmit}>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearch(e.target.value)}
              placeholder="Search for skills, users, or locations..."
              className="block w-full pl-12 pr-4 py-3 bg-gray-900 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
            />
          </form>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Availability Filter */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Clock className="h-5 w-5 text-gray-400" />
            </div>
            <select
              value={availabilityFilter}
              onChange={(e) => onAvailabilityFilter(e.target.value)}
              className="block w-full pl-12 pr-4 py-3 bg-gray-900 border border-gray-600 rounded-xl text-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 appearance-none"
            >
              <option value="">All Availability</option>
              <option value="available">Available Now</option>
              <option value="busy">Busy</option>
              <option value="offline">Offline</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
              <Filter className="h-4 w-4 text-gray-400" />
            </div>
          </div>

          {/* Location Filter */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-gray-400" />
            </div>
            <select 
              value={locationFilter}
              onChange={(e) => onLocationFilter(e.target.value)}
              className="block w-full pl-12 pr-4 py-3 bg-gray-900 border border-gray-600 rounded-xl text-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 appearance-none"
            >
              <option value="">All Locations</option>
              <option value="remote">Remote Only</option>
              <option value="local">Local Only</option>
              <option value="hybrid">Hybrid</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
              <Filter className="h-4 w-4 text-gray-400" />
            </div>
          </div>

          {/* Skill Level Filter */}
          <div className="relative flex-1">
            <select 
              value={skillLevelFilter}
              onChange={(e) => onSkillLevelFilter(e.target.value)}
              className="block w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-xl text-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
            >
              <option value="">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="expert">Expert</option>
            </select>
          </div>
        </div>

        {/* Quick Filters */}
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-gray-400 mr-2">Popular:</span>
          {['JavaScript', 'Python', 'React', 'Design', 'Marketing', 'Writing'].map((skill) => (
            <button
              key={skill}
              onClick={() => onSearch(skill)}
              className="px-3 py-1 bg-gray-700 hover:bg-cyan-600 text-gray-300 hover:text-white rounded-full text-sm transition-all duration-200"
            >
              {skill}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
