import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { FALLBACK_USERS } from '@/lib/fallbackData';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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

    if (!users || users.length === 0) {
      return NextResponse.json(FALLBACK_USERS);
    }

    return NextResponse.json(users);
  } catch (error) {
    console.error('Failed to get users, returning fallback dataset', error);
    return NextResponse.json(FALLBACK_USERS);
  }
}
