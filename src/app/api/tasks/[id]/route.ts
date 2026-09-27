import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const data = await req.json();
    const task = await prisma.task.update({
      where: { id: params.id },
      data: {
        status: data.status,
        priority: data.priority,
        title: data.title,
        assigneeName: data.assigneeName,
      },
    });
    return NextResponse.json(task);
  } catch (error) {
    console.error('Failed to update task', error);
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.task.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete task', error);
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
  }
}
