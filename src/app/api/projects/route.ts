import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { FALLBACK_PROJECTS } from '@/lib/fallbackData';

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
    console.error('Failed to get projects, returning fallback dataset', error);
    return NextResponse.json(FALLBACK_PROJECTS);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, tagline, description, domain, deadline, ownerId, imageUrl, demoUrl, repoUrl, status, roles } = body;

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
        // Find or create skill
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
    console.error('Failed to create project', error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}
