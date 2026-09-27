import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const skills = await prisma.skill.findMany({
      include: {
        userSkills: {
          include: { user: true },
        },
        projectSkills: {
          include: { project: true },
        },
      },
    });
    return NextResponse.json(skills);
  } catch (error) {
    console.error('Failed to get skills', error);
    return NextResponse.json({ error: 'Failed to fetch skills' }, { status: 500 });
  }
}
