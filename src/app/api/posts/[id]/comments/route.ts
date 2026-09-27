import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const { userId, content } = await req.json();
    const postId = params.id;

    const comment = await prisma.comment.create({
      data: {
        postId,
        userId,
        content,
      },
      include: {
        user: true,
      },
    });

    // Notify author
    const post = await prisma.post.findUnique({ where: { id: postId } });
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (post && post.userId !== userId) {
      await prisma.notification.create({
        data: {
          userId: post.userId,
          title: 'New Comment',
          message: `${user?.name || 'A peer'} commented: "${content.slice(0, 45)}..."`,
          link: '/feed',
          type: 'comment',
        },
      });
    }

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error('Failed to post comment', error);
    return NextResponse.json({ error: 'Failed to add comment' }, { status: 500 });
  }
}
