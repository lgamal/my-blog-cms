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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-pink-400 py-12">
      <div className="w-full max-w-2xl mx-auto p-8 bg-white/90 rounded-3xl shadow-2xl">
        <nav className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg shadow-lg">
              <svg width="16" height="16" className="text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <span className="text-2xl font-extrabold text-gray-900 tracking-tight">New Post</span>
          </div>
          <a href="/admin" className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all duration-200">
            <svg width="16" height="16" className="mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </a>
        </nav>
        <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">Create a New Blog Post</h2>
        <p className="mb-8 text-base text-gray-600 text-center">Fill out the form below to publish a new post to your blog.</p>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input id="title" name="title" type="text" required className="block w-full px-4 py-3 border border-blue-200 rounded-xl shadow-sm placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-gray-900 bg-white/80 text-base transition duration-150 ease-in-out" placeholder="Enter post title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
          </div>
          <div>
            <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
            <textarea id="excerpt" name="excerpt" rows={2} className="block w-full px-4 py-3 border border-blue-200 rounded-xl shadow-sm placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent text-gray-900 bg-white/80 text-base transition duration-150 ease-in-out" placeholder="Enter a short excerpt" value={formData.excerpt} onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })} />
          </div>
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">Content</label>
            <textarea id="content" name="content" rows={6} required className="block w-full px-4 py-3 border border-blue-200 rounded-xl shadow-sm placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent text-gray-900 bg-white/80 text-base transition duration-150 ease-in-out" placeholder="Write your post content here..." value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} />
          </div>
          <div className="flex flex-col md:flex-row md:space-x-4">
            <div className="flex-1 mb-4 md:mb-0">
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
              <input id="tags" name="tags" type="text" className="block w-full px-4 py-3 border border-blue-200 rounded-xl shadow-sm placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-gray-900 bg-white/80 text-base transition duration-150 ease-in-out" placeholder="e.g. tech, coding" value={formData.tags} onChange={(e) => setFormData({ ...formData, tags: e.target.value })} />
            </div>
            <div className="flex-1">
              <label htmlFor="featuredImage" className="block text-sm font-medium text-gray-700 mb-1">Featured Image URL</label>
              <input id="featuredImage" name="featuredImage" type="text" className="block w-full px-4 py-3 border border-blue-200 rounded-xl shadow-sm placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent text-gray-900 bg-white/80 text-base transition duration-150 ease-in-out" placeholder="Paste image URL" value={formData.featuredImage} onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })} />
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-base font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? (
              <div className="flex items-center">
                <svg width="16" height="16" className="animate-spin -ml-1 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Publishing...
              </div>
            ) : (
              "Publish Post"
            )}
          </button>
        </form>
      </div>
    </div>
  )
}