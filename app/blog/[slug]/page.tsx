import { notFound } from "next/navigation"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { formatDistanceToNow } from "date-fns"
import { remark } from "remark"
import html from "remark-html"

async function getPost(slug: string) {
  const post = await prisma.post.findUnique({
    where: { 
      slug,
      published: true 
    },
    include: {
      author: {
        select: { name: true }
      }
    }
  })
  
  if (!post) {
    return null
  }

  // Convert markdown to HTML
  const processedContent = await remark()
    .use(html)
    .process(post.content)
  
  return {
    ...post,
    contentHtml: processedContent.toString()
  }
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug)

  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="text-indigo-600 hover:text-indigo-500 font-medium"
          >
            ← Back to Blog
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <article className="bg-white rounded-lg shadow-lg overflow-hidden">
          {post.featuredImage && (
            <div className="aspect-video w-full">
              <img
                src={post.featuredImage}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <div className="p-8">
            <div className="mb-6">
              <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
                <span>By {post.author.name}</span>
                <span>•</span>
                <span>{formatDistanceToNow(new Date(post.createdAt))} ago</span>
              </div>
              
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {post.title}
              </h1>
              
              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-indigo-100 text-indigo-700 text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
            
            {post.excerpt && (
              <div className="text-xl text-gray-600 mb-8 p-4 bg-gray-50 rounded-lg border-l-4 border-indigo-500">
                {post.excerpt}
              </div>
            )}
            
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: post.contentHtml }}
            />
          </div>
        </article>
      </main>
    </div>
  )
}

// Generate static params for better SEO
export async function generateStaticParams() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    select: { slug: true }
  })

  return posts.map((post) => ({
    slug: post.slug
  }))
}