"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

export default function NewPost() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    published: false,
    tags: "",
    featuredImage: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.split(",").map(tag => tag.trim()).filter(Boolean)
        })
      })

      if (response.ok) {
        router.push("/admin")
      } else {
        alert("Failed to create post")
      }
    } catch (error) {
      alert("Error creating post")
    } finally {
      setLoading(false)
    }
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <svg
            width="16"
            height="16"
            className="animate-spin text-indigo-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span className="text-lg font-medium text-gray-700">Loading...</span>
        </div>
      </div>
    )
  }

  if (!session) {
    router.push("/admin/login")
    return null
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-indigo-100 to-white">
      <div className="w-full max-w-2xl mx-auto p-12 bg-white rounded-3xl shadow-2xl flex flex-col items-center">
        <div className="flex items-center space-x-3 mb-10">
          <svg width="32" height="32" className="text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          <span className="text-4xl font-extrabold text-gray-900 tracking-tight">New Post</span>
        </div>
        <form onSubmit={handleSubmit} className="w-full space-y-8">
          <div>
            <label htmlFor="title" className="block text-lg font-semibold text-gray-700 mb-2">Title</label>
            <input
              id="title"
              name="title"
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="block w-full px-6 py-4 border-2 border-blue-200 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-blue-50 placeholder-blue-300 font-medium"
              placeholder="Post title"
            />
          </div>
          <div>
            <label htmlFor="excerpt" className="block text-lg font-semibold text-gray-700 mb-2">Excerpt</label>
            <textarea
              id="excerpt"
              name="excerpt"
              rows={2}
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              className="block w-full px-6 py-4 border-2 border-blue-200 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-blue-50 placeholder-blue-300 font-medium"
              placeholder="A short summary of your post"
            />
          </div>
          <div>
            <label htmlFor="content" className="block text-lg font-semibold text-gray-700 mb-2">Content</label>
            <textarea
              id="content"
              name="content"
              rows={8}
              required
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="block w-full px-6 py-4 border-2 border-blue-200 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-blue-50 placeholder-blue-300 font-medium"
              placeholder="Write your post here..."
            />
          </div>
          <div className="flex space-x-4">
            <button
              type="submit"
              className="flex-1 flex justify-center items-center px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-lg font-bold rounded-xl shadow-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
              disabled={loading}
            >
              {loading ? (
                <svg width="20" height="20" className="animate-spin mr-3 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
              ) : null}
              {loading ? "Publishing..." : "Publish Post"}
            </button>
            <button
              type="button"
              onClick={() => router.push('/admin')}
              className="flex-1 flex justify-center items-center px-6 py-4 bg-gray-200 text-gray-700 text-lg font-bold rounded-xl shadow-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}