import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const project = await prisma.project.findUnique({
      where: { id: params.id },
      include: {
        owner: true,
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
        tasks: {
          orderBy: { createdAt: 'desc' },
        },
        collabReqs: {
          include: { sender: true, receiver: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    return NextResponse.json(project);
  } catch (error) {
    console.error('Failed to fetch project', error);
    return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
  }
}
