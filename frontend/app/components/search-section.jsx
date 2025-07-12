"use client"

export default function SearchSection({ onSearch, onAvailabilityFilter, searchTerm, availabilityFilter }) {
  const handleSearchSubmit = (e) => {
    e.preventDefault()
    // Search is handled by the onChange event
  }

  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
        <select
          value={availabilityFilter}
          onChange={(e) => onAvailabilityFilter(e.target.value)}
          className="bg-gray-900 border-2 border-white text-white px-4 py-2 rounded-full text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-white"
        >
          <option value="">Availability</option>
          <option value="available">Available</option>
          <option value="busy">Busy</option>
          <option value="offline">Offline</option>
        </select>

        <form onSubmit={handleSearchSubmit} className="flex flex-1 max-w-md">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search skills..."
            className="flex-1 bg-gray-900 border-2 border-white border-r-0 text-white px-4 py-2 rounded-l-full text-sm focus:outline-none focus:ring-2 focus:ring-white placeholder-gray-400"
          />
          <button
            type="submit"
            className="bg-gray-900 border-2 border-white border-l-0 text-white px-4 py-2 rounded-r-full text-sm hover:bg-gray-800 transition-colors duration-300"
          >
            search
          </button>
        </form>
      </div>
    </div>
  )
}
