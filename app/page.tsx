import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { formatDistanceToNow } from "date-fns"

async function getPosts() {
  return await prisma.post.findMany({
    where: { published: true },
    include: {
      author: {
        select: { name: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  })
}

export default async function Home() {
  const posts = await getPosts()

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">My Blog</h1>
            <Link
              href="/admin"
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Admin
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-medium text-gray-900 mb-4">No posts yet</h2>
            <p className="text-gray-500">Check back later for new content!</p>
          </div>
        ) : (
          <div className="space-y-8">
            {posts.map((post) => (
              <article key={post.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">
                      By {post.author.name}
                    </span>
                    <span className="text-gray-300">•</span>
                    <span className="text-sm text-gray-500">
                      {formatDistanceToNow(new Date(post.createdAt))} ago
                    </span>
                  </div>
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  <Link 
                    href={`/blog/${post.slug}`}
                    className="hover:text-indigo-600 transition-colors"
                  >
                    {post.title}
                  </Link>
                </h2>
                
                {post.excerpt && (
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {post.excerpt}
                  </p>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-indigo-600 hover:text-indigo-500 font-medium text-sm"
                  >
                    Read more →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}