import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { projectId, senderId, receiverId, role, message } = await req.json();

    const collab = await prisma.collaborationRequest.create({
      data: {
        projectId,
        senderId,
        receiverId,
        role: role || 'Teammate',
        message,
        status: 'pending',
      },
      include: {
        project: true,
        sender: true,
        receiver: true,
      },
    });

    // Notify receiver with direct link to profile requests
    await prisma.notification.create({
      data: {
        userId: receiverId,
        title: 'New Match Request!',
        message: `${collab.sender.name} sent you a match request to join "${collab.project.title}" as ${role}.`,
        link: `/profile/${receiverId}`,
        type: 'invitation',
      },
    });

    return NextResponse.json(collab, { status: 201 });
  } catch (error) {
    console.error('Failed to create collaboration request', error);
    return NextResponse.json({ error: 'Failed to create request' }, { status: 500 });
  }
}
