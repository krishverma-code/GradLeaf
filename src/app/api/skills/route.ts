import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { FALLBACK_SKILLS } from '@/lib/fallbackData';

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

    if (!skills || skills.length === 0) {
      return NextResponse.json(FALLBACK_SKILLS);
    }

    return NextResponse.json(skills);
  } catch (error) {
    console.error('Failed to get skills, returning fallback dataset', error);
    return NextResponse.json(FALLBACK_SKILLS);
  }
}
