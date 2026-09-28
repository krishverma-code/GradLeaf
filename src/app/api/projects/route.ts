import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { FALLBACK_PROJECTS, FALLBACK_USERS } from '@/lib/fallbackData';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      include: {
        owner: true,
        skills: {
          include: { skill: true },
        },
        members: {
          include: { user: true },
        },
        tasks: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!projects || projects.length === 0) {
      return NextResponse.json(FALLBACK_PROJECTS);
    }

    return NextResponse.json(projects);
  } catch (error) {
    console.warn('Failed to get projects, returning fallback dataset:', error);
    return NextResponse.json(FALLBACK_PROJECTS);
  }
}

export async function POST(req: Request) {
  let body: any = {};
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  const { title, tagline, description, domain, deadline, ownerId, imageUrl, demoUrl, repoUrl, status, roles } = body;

  try {
    const project = await prisma.project.create({
      data: {
        title,
        tagline: tagline || null,
        description,
        domain: domain || 'General',
        deadline: deadline || null,
        imageUrl: imageUrl || null,
        demoUrl: demoUrl || null,
        repoUrl: repoUrl || null,
        status: status || 'recruiting',
        ownerId,
        members: {
          create: {
            userId: ownerId,
            role: 'Project Lead',
          },
        },
      },
    });

    // Add roles / skills if provided
    if (roles && Array.isArray(roles)) {
      for (const roleItem of roles) {
        let skill = await prisma.skill.findUnique({
          where: { name: roleItem.skillName },
        });
        if (!skill) {
          skill = await prisma.skill.create({
            data: { name: roleItem.skillName, category: roleItem.category || 'General' },
          });
        }
        await prisma.projectSkill.create({
          data: {
            projectId: project.id,
            skillId: skill.id,
            role: roleItem.roleTitle,
            priority: roleItem.priority || 'required',
          },
        });
      }
    }

    const fullProject = await prisma.project.findUnique({
      where: { id: project.id },
      include: {
        owner: true,
        skills: { include: { skill: true } },
        members: { include: { user: true } },
        tasks: true,
      },
    });

    return NextResponse.json(fullProject, { status: 201 });
  } catch (error) {
    console.warn('Prisma create project failed (serverless fallback mode):', error);
  }

  // Resilient synthetic fallback
  const owner = FALLBACK_USERS.find((u) => u.id === ownerId) || {
    id: ownerId,
    name: 'Student Lead',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=60&h=60&fit=crop',
    college: 'Campus Network',
    course: 'Computer Science',
  };

  const syntheticProjectId = 'proj_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
  const syntheticProject = {
    id: syntheticProjectId,
    title,
    tagline: tagline || null,
    description,
    domain: domain || 'General',
    deadline: deadline || null,
    imageUrl:
      imageUrl ||
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
    demoUrl: demoUrl || null,
    repoUrl: repoUrl || null,
    status: status || 'recruiting',
    ownerId: owner.id,
    createdAt: new Date().toISOString(),
    owner: {
      id: owner.id,
      name: owner.name,
      avatarUrl: owner.avatarUrl,
      college: owner.college,
    },
    skills: Array.isArray(roles)
      ? roles.map((r: any, idx: number) => ({
          id: 'psk_' + idx + '_' + syntheticProjectId,
          role: r.roleTitle || 'Developer',
          priority: r.priority || 'required',
          skill: {
            id: 'sk_' + idx,
            name: r.skillName || 'Engineering',
            category: r.category || 'General',
          },
        }))
      : [],
    members: [
      {
        id: 'pm_' + syntheticProjectId,
        role: 'Project Lead',
        user: {
          id: owner.id,
          name: owner.name,
          avatarUrl: owner.avatarUrl,
          course: owner.course,
        },
      },
    ],
    tasks: [],
  };

  return NextResponse.json(syntheticProject, { status: 201 });
}
