import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const published = searchParams.get('published') !== 'false';

    const where = published ? { published: true } : {};

    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: { author: { select: { name: true } } },
      }),
      prisma.blogPost.count({ where }),
    ]);

    return NextResponse.json({
      posts,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const post = await prisma.blogPost.create({
      data: {
        title: body.title,
        slug: body.slug,
        excerpt: body.excerpt || '',
        content: body.content,
        coverImage: body.coverImage,
        published: body.published || false,
        featured: body.featured || false,
        tags: body.tags || [],
        authorId: 'admin-user-001',
        publishedAt: body.published ? new Date() : null,
      },
    });
    return NextResponse.json({ success: true, post });
  } catch (error) {
    console.error('Blog create error:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
