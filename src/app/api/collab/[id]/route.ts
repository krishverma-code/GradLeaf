import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const { status } = await req.json(); // "accepted" | "rejected"
    const reqItem = await prisma.collaborationRequest.update({
      where: { id: params.id },
      data: { status },
      include: {
        project: true,
        sender: true,
        receiver: true,
      },
    });

    if (status === 'accepted') {
      // Determine joining user and the party to notify
      const isOwnerSender = reqItem.project.ownerId === reqItem.senderId;
      const joiningUserId = isOwnerSender ? reqItem.receiverId : reqItem.senderId;
      const notifyingUserId = isOwnerSender ? reqItem.senderId : reqItem.receiverId;
      const joiningUser = isOwnerSender ? reqItem.receiver : reqItem.sender;

      // Add user to project members
      await prisma.projectMember.upsert({
        where: {
          projectId_userId: {
            projectId: reqItem.projectId,
            userId: joiningUserId,
          },
        },
        create: {
          projectId: reqItem.projectId,
          userId: joiningUserId,
          role: reqItem.role,
        },
        update: {
          role: reqItem.role,
        },
      });

      // Notify the other party
      await prisma.notification.create({
        data: {
          userId: notifyingUserId,
          title: 'Collaboration Confirmed',
          message: `${joiningUser.name} is now on board "${reqItem.project.title}" as ${reqItem.role}!`,
          link: `/workspace/${reqItem.projectId}`,
          type: 'invitation_accepted',
        },
      });
    }

    return NextResponse.json(reqItem);
  } catch (error) {
    console.error('Failed to update collaboration request', error);
    return NextResponse.json({ error: 'Failed to update request' }, { status: 500 });
  }
}
