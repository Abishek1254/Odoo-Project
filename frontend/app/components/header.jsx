"use client"

export default function Header({ isLoggedIn, onLogin }) {
  return (
    <header className="border-b-2 border-white pb-6 mb-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-center md:text-left">
          <h1 className="text-2xl font-normal mb-2">Home page</h1>
          <h2 className="text-xl font-normal">Skill Swap Platform</h2>
        </div>
        <button
          onClick={onLogin}
          className="border-2 border-white px-6 py-2 rounded-full hover:bg-white hover:text-gray-900 transition-all duration-300"
        >
          {isLoggedIn ? "Logout" : "Login"}
        </button>
      </div>
    </header>
  )
}
