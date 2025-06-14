"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { format } from "date-fns"
import { Plus, Home, Edit3, Eye, Calendar, User, FileText, Search, Bell, Settings } from "lucide-react"

interface Post {
  id: string
  title: string
  slug: string
  published: boolean
  createdAt: string
  author: {
    name: string
  }
}

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login")
    }
  }, [status, router])

  useEffect(() => {
    if (session) {
      fetchPosts()
    }
  }, [session])

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/posts")
      const data = await response.json()
      setPosts(data)
    } catch (error) {
      console.error("Failed to fetch posts:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.author.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-t-purple-500 rounded-full animate-spin animation-delay-75"></div>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-white mb-1">Loading Dashboard</h3>
            <p className="text-gray-400 text-sm">Please wait while we fetch your content...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-pink-400">
      <div className="w-full max-w-5xl mx-auto p-8 bg-white/90 rounded-3xl shadow-2xl mt-8 mb-8">
        {/* Modern Navigation */}
        <nav className="flex flex-col md:flex-row md:justify-between md:items-center mb-8">
          <div className="flex items-center space-x-3 mb-4 md:mb-0">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg shadow-lg">
              <FileText size={16} className="text-white" />
            </div>
            <span className="text-3xl font-extrabold text-gray-900 tracking-tight">BlogAdmin</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" />
              <input
                type="text"
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white/80 border border-blue-200 rounded-xl text-gray-900 placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent w-64 text-base shadow-sm"
              />
            </div>
            <button className="p-2 text-blue-400 hover:text-white hover:bg-blue-400/20 rounded-lg transition-colors">
              <Bell size={16} />
            </button>
            <button className="p-2 text-purple-400 hover:text-white hover:bg-purple-400/20 rounded-lg transition-colors">
              <Settings size={16} />
            </button>
            <Link
              href="/admin/posts/new"
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all duration-200"
            >
              <Plus size={16} className="mr-2" />
              New Post
            </Link>
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 bg-white/80 text-blue-600 font-semibold rounded-xl shadow hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all duration-200 border border-blue-200"
            >
              <Home size={16} className="mr-2" />
              View Site
            </Link>
          </div>
        </nav>
        {/* Header Section */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Content Management</h1>
          <p className="text-lg text-gray-600">Manage your blog posts and content from here.</p>
        </div>
        {/* Posts Container */}
        <div className="bg-gradient-to-br from-white/80 to-blue-100 rounded-2xl border border-blue-200 overflow-hidden shadow-xl">
          <div className="px-6 py-4 border-b border-blue-200 bg-gradient-to-r from-white/80 to-purple-100">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">All Posts</h2>
              <span className="px-3 py-1 text-base font-semibold text-blue-700 bg-blue-200/60 rounded-full border border-blue-300">
                {filteredPosts.length} {filteredPosts.length === 1 ? "post" : "posts"}
                {searchTerm && " found"}
              </span>
            </div>
          </div>
          {filteredPosts.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText size={16} className="text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {searchTerm ? "No posts found" : "No posts yet"}
              </h3>
              <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                {searchTerm 
                  ? `No posts match "${searchTerm}". Try adjusting your search.`
                  : "Get started by creating your first blog post."}
              </p>
              {!searchTerm && (
                <Link
                  href="/admin/posts/new"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all duration-200"
                >
                  <Plus size={16} className="mr-2" />
                  Create Your First Post
                </Link>
              )}
            </div>
          ) : (
            <div className="divide-y divide-blue-200">
              {filteredPosts.map((post, index) => (
                <div
                  key={post.id}
                  className="px-6 py-6 hover:bg-blue-50 transition-all duration-200 group"
                  style={{
                    animationDelay: `${index * 50}ms`,
                    animation: 'fadeInUp 0.5s ease-out forwards'
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0 pr-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                        {post.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-4 text-base text-gray-600">
                        <span className="flex items-center">
                          <User size={16} className="mr-1.5 text-blue-400" />
                          {post.author.name}
                        </span>
                        <span className="flex items-center">
                          <Calendar size={16} className="mr-1.5 text-purple-400" />
                          {format(new Date(post.createdAt), "MMM d, yyyy")}
                        </span>
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                            post.published
                              ? "bg-green-200 text-green-800 border border-green-300"
                              : "bg-yellow-200 text-yellow-800 border border-yellow-300"
                          }`}
                        >
                          <div className={`w-2 h-2 rounded-full mr-2 ${
                            post.published ? "bg-green-400" : "bg-yellow-400"
                          }`}></div>
                          {post.published ? "Published" : "Draft"}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Link
                        href={`/admin/posts/${post.id}/edit`}
                        className="inline-flex items-center px-3 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl shadow hover:from-blue-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all duration-200 border border-blue-200 group/btn"
                      >
                        <Edit3 size={16} className="mr-2 group-hover/btn:text-blue-200" />
                        Edit
                      </Link>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="inline-flex items-center px-3 py-2 bg-white/80 text-blue-600 font-semibold rounded-xl shadow hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all duration-200 border border-blue-200"
                      >
                        <Eye size={16} className="mr-2" />
                        View
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animation-delay-75 {
          animation-delay: 75ms;
        }
      `}</style>
    </div>
  )
}