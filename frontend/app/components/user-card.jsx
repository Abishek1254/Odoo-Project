"use client"

export default function UserCard({ user, onRequest }) {
  return (
    <div className="border-2 border-white rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6">
      <div className="w-20 h-20 border-2 border-white rounded-full flex items-center justify-center text-xs text-center bg-gray-800 flex-shrink-0">
        Profile Photo
      </div>

      <div className="flex-1 text-center md:text-left">
        <h3 className="text-xl mb-3">{user.name}</h3>

        <div className="mb-3">
          <span className="text-green-400 text-sm mr-3">Skills Offered =&gt;</span>
          <div className="inline-flex flex-wrap gap-2 mt-1">
            {user.skillsOffered.map((skill, index) => (
              <span key={index} className="border border-white px-3 py-1 rounded-full text-xs">
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div>
          <span className="text-blue-400 text-sm mr-3">Skill wanted =&gt;</span>
          <div className="inline-flex flex-wrap gap-2 mt-1">
            {user.skillsWanted.map((skill, index) => (
              <span key={index} className="border border-white px-3 py-1 rounded-full text-xs">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-3">
        <button
          onClick={() => onRequest(user.id)}
          className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2 rounded-lg transition-colors duration-300"
        >
          Request
        </button>
        <div className="text-sm text-gray-400">rating {user.rating}</div>
      </div>
    </div>
  )
}
