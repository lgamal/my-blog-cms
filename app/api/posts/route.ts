import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const published = searchParams.get('published')
  
  try {
    const posts = await prisma.post.findMany({
      where: published === 'true' ? { published: true } : {},
      include: {
        author: {
          select: { name: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    
    return NextResponse.json(posts)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    )
  }

  try {
    const body = await request.json()
    const { title, content, excerpt, published, tags, featuredImage } = body
    
    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
    
    const post = await prisma.post.create({
      data: {
        title,
        slug,
        content,
        excerpt,
        published: published || false,
        tags: tags || [],
        featuredImage,
        authorId: session.user.id
      }
    })
    
    return NextResponse.json(post)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    )
  }
}