import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { FALLBACK_POSTS } from '@/lib/fallbackData';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      include: {
        user: true,
        comments: {
          include: { user: true },
          orderBy: { createdAt: 'asc' },
        },
        likes: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!posts || posts.length === 0) {
      return NextResponse.json(FALLBACK_POSTS);
    }

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Failed to get posts, returning fallback dataset', error);
    return NextResponse.json(FALLBACK_POSTS);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, content, tag } = body;

    if (!userId || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const post = await prisma.post.create({
      data: {
        userId,
        content,
        tag: tag || 'General',
      },
      include: {
        user: true,
        comments: { include: { user: true } },
        likes: true,
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error('Failed to create post', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
