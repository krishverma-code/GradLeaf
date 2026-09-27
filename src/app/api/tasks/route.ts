import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { projectId, title, description, priority, assigneeName, status } = await req.json();

    const task = await prisma.task.create({
      data: {
        projectId,
        title,
        description,
        priority: priority || 'medium',
        assigneeName,
        status: status || 'todo',
      },
    });
    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error('Failed to create task', error);
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}
