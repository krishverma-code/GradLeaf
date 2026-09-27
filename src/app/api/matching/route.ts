import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { computeProjectMatches } from '@/lib/matchingAlgorithm';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get('projectId');
    const excludeUserId = searchParams.get('excludeUserId');

    if (!projectId) {
      return NextResponse.json({ error: 'projectId is required' }, { status: 400 });
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        skills: {
          include: { skill: true },
        },
        members: {
          include: {
            user: {
              include: { skills: { include: { skill: true } } },
            },
          },
        },
      },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Existing team member user IDs, project owner, and the active session user
    const memberIds = new Set(project.members.map((m) => m.userId));
    if (project.ownerId) {
      memberIds.add(project.ownerId);
    }
    if (excludeUserId) {
      memberIds.add(excludeUserId);
    }

    // Get all candidate students not currently in the project
    const candidates = await prisma.user.findMany({
      where: {
        id: { notIn: Array.from(memberIds) },
      },
      include: {
        skills: {
          include: { skill: true },
        },
        projectMembers: {
          include: { project: true },
        },
      },
    });

    const matches = computeProjectMatches(project, candidates);

    return NextResponse.json({
      project: {
        id: project.id,
        title: project.title,
        domain: project.domain,
        requiredSkills: project.skills.map((s) => ({
          name: s.skill.name,
          role: s.role,
          priority: s.priority,
        })),
        currentTeamSize: project.members.length,
      },
      matches,
    });
  } catch (error) {
    console.error('Matching engine error:', error);
    return NextResponse.json({ error: 'Matching failed' }, { status: 500 });
  }
}
