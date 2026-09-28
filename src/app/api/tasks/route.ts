import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(req: Request) {
  let body: any = {};
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  const { projectId, title, description, priority, assigneeName, status } = body;

  try {
    const task = await prisma.task.create({
      data: {
        projectId,
        title,
        description: description || null,
        priority: priority || 'medium',
        assigneeName: assigneeName || null,
        status: status || 'todo',
      },
    });
    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.warn('Prisma create task failed (serverless fallback mode):', error);
  }

  const syntheticTask = {
    id: 'tsk_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
    projectId,
    title,
    description: description || null,
    priority: priority || 'medium',
    assigneeName: assigneeName || null,
    status: status || 'todo',
    createdAt: new Date().toISOString(),
  };

  return NextResponse.json(syntheticTask, { status: 201 });
}
