"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"

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

  if (status === "loading" || loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">Blog Admin</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/admin/posts/new"
                className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
              >
                New Post
              </Link>
              <Link
                href="/"
                className="text-gray-500 hover:text-gray-700"
              >
                View Site
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">All Posts</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {posts.length === 0 ? (
                <div className="px-6 py-4 text-gray-500">
                  No posts yet. <Link href="/admin/posts/new" className="text-indigo-600 hover:text-indigo-500">Create your first post</Link>
                </div>
              ) : (
                posts.map((post) => (
                  <div key={post.id} className="px-6 py-4 flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">{post.title}</h3>
                      <p className="text-sm text-gray-500">
                        {post.published ? "Published" : "Draft"} • {new Date(post.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Link
                        href={`/admin/posts/${post.id}/edit`}
                        className="text-indigo-600 hover:text-indigo-500 text-sm"
                      >
                        Edit
                      </Link>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="text-gray-400 hover:text-gray-500 text-sm"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}