import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const { userId } = await req.json();
    const postId = params.id;

    const existing = await prisma.postLike.findUnique({
      where: {
        postId_userId: {
          postId,
          userId,
        },
      },
    });

    if (existing) {
      await prisma.postLike.delete({
        where: { id: existing.id },
      });
      return NextResponse.json({ liked: false });
    } else {
      await prisma.postLike.create({
        data: { postId, userId },
      });

      // Notify post author if not self
      const post = await prisma.post.findUnique({ where: { id: postId } });
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (post && post.userId !== userId) {
        await prisma.notification.create({
          data: {
            userId: post.userId,
            title: 'New Like',
            message: `${user?.name || 'Someone'} reacted to your post!`,
            link: '/feed',
            type: 'like',
          },
        });
      }

      return NextResponse.json({ liked: true });
    }
  } catch (error) {
    console.error('Failed to toggle like', error);
    return NextResponse.json({ error: 'Failed to toggle like' }, { status: 500 });
  }
}
