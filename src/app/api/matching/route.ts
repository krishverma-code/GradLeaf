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

    let currentProject = project;
    if (!currentProject) {
      const { FALLBACK_PROJECTS } = await import('@/lib/fallbackData');
      currentProject = (FALLBACK_PROJECTS.find((p) => p.id === projectId) || FALLBACK_PROJECTS[0]) as any;
    }

    if (!currentProject) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Existing team member user IDs, project owner, and the active session user
    const memberIds = new Set(currentProject.members.map((m: any) => m.userId));
    if (currentProject.ownerId) {
      memberIds.add(currentProject.ownerId);
    }
    if (excludeUserId) {
      memberIds.add(excludeUserId);
    }

    // Get all candidate students not currently in the project
    let candidates = await prisma.user.findMany({
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

    if (!candidates || candidates.length === 0) {
      const { FALLBACK_USERS } = await import('@/lib/fallbackData');
      candidates = FALLBACK_USERS.filter((u) => !memberIds.has(u.id)) as any;
    }

    const matches = computeProjectMatches(currentProject, candidates);

    return NextResponse.json({
      project: {
        id: currentProject.id,
        title: currentProject.title,
        domain: currentProject.domain,
        requiredSkills: currentProject.skills.map((s: any) => ({
          name: s.skill?.name || s.name,
          role: s.role,
          priority: s.priority,
        })),
        currentTeamSize: currentProject.members.length,
      },
      matches,
    });
  } catch (error) {
    console.error('Matching engine error:', error);
    return NextResponse.json({ error: 'Matching failed' }, { status: 500 });
  }
}
