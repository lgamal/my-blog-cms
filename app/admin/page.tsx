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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800">
      {/* Modern Navigation */}
      <nav className="bg-white/10 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 text-white" style={{ width: 16, height: 16, minWidth: 16, minHeight: 16, maxWidth: 16, maxHeight: 16 }} />
                </div>
                <span className="text-xl font-bold text-white">BlogAdmin</span>
              </div>
              
              {/* Quick Stats */}
              <div className="hidden md:flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{posts.length}</div>
                  <div className="text-xs text-gray-400">Total Posts</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">{posts.filter(p => p.published).length}</div>
                  <div className="text-xs text-gray-400">Published</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">{posts.filter(p => !p.published).length}</div>
                  <div className="text-xs text-gray-400">Drafts</div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden md:block">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" style={{ width: 16, height: 16, minWidth: 16, minHeight: 16, maxWidth: 16, maxHeight: 16 }} />
                  <input
                    type="text"
                    placeholder="Search posts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                  />
                </div>
              </div>
              
              <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                <Bell className="w-5 h-5" style={{ width: 16, height: 16, minWidth: 16, minHeight: 16, maxWidth: 16, maxHeight: 16 }} />
              </button>
              
              <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                <Settings className="w-5 h-5" style={{ width: 16, height: 16, minWidth: 16, minHeight: 16, maxWidth: 16, maxHeight: 16 }} />
              </button>

              <Link
                href="/admin/posts/new"
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Plus className="w-4 h-4 mr-2" style={{ width: 16, height: 16, minWidth: 16, minHeight: 16, maxWidth: 16, maxHeight: 16 }} />
                New Post
              </Link>

              <Link
                href="/"
                className="inline-flex items-center px-4 py-2 bg-white/10 text-white font-medium rounded-lg hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-200 border border-white/20"
              >
                <Home className="w-4 h-4 mr-2" style={{ width: 16, height: 16, minWidth: 16, minHeight: 16, maxWidth: 16, maxHeight: 16 }} />
                View Site
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Content Management</h1>
          <p className="text-gray-400">Manage your blog posts and content from here.</p>
        </div>

        {/* Posts Container */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
          <div className="px-6 py-4 border-b border-white/10 bg-gradient-to-r from-white/5 to-transparent">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">All Posts</h2>
              <div className="flex items-center space-x-4">
                <span className="px-3 py-1 text-sm font-medium text-blue-200 bg-blue-500/20 rounded-full border border-blue-500/30">
                  {filteredPosts.length} {filteredPosts.length === 1 ? "post" : "posts"}
                  {searchTerm && " found"}
                </span>
              </div>
            </div>
          </div>

          {filteredPosts.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-gray-400" style={{ width: 16, height: 16, minWidth: 16, minHeight: 16, maxWidth: 16, maxHeight: 16 }} />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {searchTerm ? "No posts found" : "No posts yet"}
              </h3>
              <p className="text-gray-400 mb-6 max-w-sm mx-auto">
                {searchTerm 
                  ? `No posts match "${searchTerm}". Try adjusting your search.`
                  : "Get started by creating your first blog post."
                }
              </p>
              {!searchTerm && (
                <Link
                  href="/admin/posts/new"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <Plus className="w-4 h-4 mr-2" style={{ width: 16, height: 16, minWidth: 16, minHeight: 16, maxWidth: 16, maxHeight: 16 }} />
                  Create Your First Post
                </Link>
              )}
            </div>
          ) : (
            <div className="divide-y divide-white/10">
              {filteredPosts.map((post, index) => (
                <div
                  key={post.id}
                  className="px-6 py-6 hover:bg-white/5 transition-all duration-200 group"
                  style={{
                    animationDelay: `${index * 50}ms`,
                    animation: 'fadeInUp 0.5s ease-out forwards'
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0 pr-6">
                      <h3 className="text-lg font-semibold text-white mb-3 group-hover:text-blue-300 transition-colors">
                        {post.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                        <span className="flex items-center">
                          <User className="w-4 h-4 mr-1.5 text-gray-500" style={{ width: 16, height: 16, minWidth: 16, minHeight: 16, maxWidth: 16, maxHeight: 16 }} />
                          {post.author.name}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1.5 text-gray-500" style={{ width: 16, height: 16, minWidth: 16, minHeight: 16, maxWidth: 16, maxHeight: 16 }} />
                          {format(new Date(post.createdAt), "MMM d, yyyy")}
                        </span>
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                            post.published
                              ? "bg-green-500/20 text-green-300 border border-green-500/30"
                              : "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
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
                        className="inline-flex items-center px-3 py-2 bg-white/10 text-white font-medium rounded-lg hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-200 border border-white/20 group/btn"
                      >
                        <Edit3 className="w-4 h-4 mr-2 group-hover/btn:text-blue-300" style={{ width: 16, height: 16, minWidth: 16, minHeight: 16, maxWidth: 16, maxHeight: 16 }} />
                        Edit
                      </Link>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="inline-flex items-center px-3 py-2 bg-gradient-to-r from-blue-500/20 to-purple-600/20 text-blue-200 font-medium rounded-lg hover:from-blue-500/30 hover:to-purple-600/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200 border border-blue-500/30"
                      >
                        <Eye className="w-4 h-4 mr-2" style={{ width: 16, height: 16, minWidth: 16, minHeight: 16, maxWidth: 16, maxHeight: 16 }} />
                        View
                      </Link>
                    </div>
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
        
        .animation-delay-75 {
          animation-delay: 75ms;
        }
      `}</style>
    </div>
  )
}