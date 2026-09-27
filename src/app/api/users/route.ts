import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: {
        skills: {
          include: {
            skill: true,
          },
        },
        notifications: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        receivedCollab: {
          where: { status: 'pending' },
          include: {
            project: true,
            sender: true,
          },
          orderBy: { createdAt: 'desc' },
        },
        projectMembers: {
          include: {
            project: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
    return NextResponse.json(users);
  } catch (error) {
    console.error('Failed to get users', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}
