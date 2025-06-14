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
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-indigo-100 to-white">
      {/* Modern Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-8 sm:px-12 lg:px-16">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <FileText size={24} className="text-white" />
                </div>
                <span className="ml-4 text-3xl font-extrabold text-gray-900 tracking-tight">BlogAdmin</span>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="relative">
                <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-400" />
                <input
                  type="text"
                  placeholder="Search posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 pr-4 py-4 border-2 border-blue-200 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-80 bg-blue-50 placeholder-blue-300 font-medium"
                />
              </div>
              <button className="p-3 text-blue-500 hover:text-white hover:bg-blue-500/20 rounded-xl transition-colors">
                <Bell size={20} />
              </button>
              <button className="p-3 text-indigo-500 hover:text-white hover:bg-indigo-500/20 rounded-xl transition-colors">
                <Settings size={20} />
              </button>
              <Link
                href="/admin/posts/new"
                className="inline-flex items-center px-6 py-3 border border-transparent text-lg font-bold rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus size={20} className="mr-2" />
                New Post
              </Link>
              <Link
                href="/"
                className="inline-flex items-center px-6 py-3 border border-blue-200 text-lg font-bold rounded-xl text-blue-700 bg-white shadow-lg hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Home size={20} className="mr-2" />
                View Site
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-12 sm:px-8 lg:px-16">
        {/* Header */}
        <div className="px-2 sm:px-0 mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">Content Management</h1>
          <p className="mt-2 text-lg text-gray-600">Manage your blog posts and content from here.</p>
        </div>

        {/* Posts Container */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">All Posts</h2>
            <span className="px-4 py-2 text-lg font-bold text-blue-700 bg-blue-100 rounded-full">
              {filteredPosts.length} {filteredPosts.length === 1 ? "post" : "posts"}
              {searchTerm && " found"}
            </span>
          </div>

          {filteredPosts.length === 0 ? (
            <div className="py-20 text-center">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <FileText size={24} className="text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {searchTerm ? "No posts found" : "No posts yet"}
              </h3>
              <p className="text-lg text-gray-500 mb-8 max-w-md mx-auto">
                {searchTerm 
                  ? `No posts match \"${searchTerm}\". Try adjusting your search.`
                  : "Get started by creating your first blog post."}
              </p>
              {!searchTerm && (
                <Link
                  href="/admin/posts/new"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-lg font-bold rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Plus size={20} className="mr-2" />
                  Create Your First Post
                </Link>
              )}
            </div>
          ) : (
            <div className="divide-y divide-blue-100">
              {filteredPosts.map((post, index) => (
                <div
                  key={post.id}
                  className="py-8 flex flex-col md:flex-row md:items-center md:justify-between transition-colors group px-2"
                  style={{
                    animationDelay: `${index * 50}ms`,
                    animation: 'fadeInUp 0.5s ease-out forwards'
                  }}
                >
                  <div className="flex-1 min-w-0 md:pr-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {post.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-6 text-lg text-gray-500">
                      <span className="flex items-center">
                        <User size={20} className="mr-2 text-blue-400" />
                        {post.author.name}
                      </span>
                      <span className="flex items-center">
                        <Calendar size={20} className="mr-2 text-indigo-400" />
                        {format(new Date(post.createdAt), "MMM d, yyyy")}
                      </span>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-base font-bold ${
                          post.published
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {post.published ? "Published" : "Draft"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 mt-6 md:mt-0">
                    <Link
                      href={`/admin/posts/${post.id}/edit`}
                      className="inline-flex items-center px-5 py-3 border border-blue-200 text-lg font-bold rounded-xl text-blue-700 bg-white shadow-lg hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <Edit3 size={20} className="mr-2" />
                      Edit
                    </Link>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center px-5 py-3 border border-transparent text-lg font-bold rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <Eye size={20} className="mr-2" />
                      View
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

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
      `}</style>
    </div>
  )
}