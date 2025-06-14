"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function AdminLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false
      })

      if (result?.error) {
        setError("Invalid email or password")
      } else {
        router.push("/admin")
      }
    } catch (error) {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-indigo-100 to-white">
      <div className="w-full max-w-lg mx-auto p-12 bg-white rounded-3xl shadow-2xl flex flex-col items-center">
        <div className="flex items-center space-x-3 mb-10">
          <svg width="32" height="32" className="text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          <span className="text-4xl font-extrabold text-gray-900 tracking-tight">Admin Login</span>
        </div>
        <form onSubmit={handleSubmit} className="w-full space-y-8">
          <div>
            <label htmlFor="email" className="block text-lg font-semibold text-gray-700 mb-2">Email</label>
            <div className="relative">
              <svg width="20" height="20" className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12A4 4 0 118 12a4 4 0 018 0zM12 14v2m0 4h.01" />
              </svg>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-12 pr-4 py-4 border-2 border-blue-200 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-blue-50 placeholder-blue-300 font-medium"
                placeholder="admin@example.com"
              />
            </div>
          </div>
          <div>
            <label htmlFor="password" className="block text-lg font-semibold text-gray-700 mb-2">Password</label>
            <div className="relative">
              <svg width="20" height="20" className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0a2 2 0 01-2-2h4a2 2 0 01-2 2zm6-6V7a6 6 0 10-12 0v2a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2v-6a2 2 0 00-2-2z" />
              </svg>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-12 pr-4 py-4 border-2 border-blue-200 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-blue-50 placeholder-blue-300 font-medium"
                placeholder="••••••••"
              />
            </div>
          </div>
          {error && (
            <div className="text-red-600 text-base text-center font-semibold">{error}</div>
          )}
          <button
            type="submit"
            className="w-full flex justify-center items-center px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-lg font-bold rounded-xl shadow-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
            disabled={loading}
          >
            {loading ? (
              <svg width="20" height="20" className="animate-spin mr-3 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
            ) : null}
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  )
}