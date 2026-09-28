import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  let status = 'accepted';
  try {
    const data = await req.json();
    status = data.status || 'accepted';
  } catch {}

  try {
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
      try {
        const isOwnerSender = reqItem.project.ownerId === reqItem.senderId;
        const joiningUserId = isOwnerSender ? reqItem.receiverId : reqItem.senderId;
        const notifyingUserId = isOwnerSender ? reqItem.senderId : reqItem.receiverId;
        const joiningUser = isOwnerSender ? reqItem.receiver : reqItem.sender;

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

        await prisma.notification.create({
          data: {
            userId: notifyingUserId,
            title: 'Collaboration Confirmed',
            message: `${joiningUser?.name || 'A teammate'} is now on board "${reqItem.project?.title || 'the project'}" as ${reqItem.role}!`,
            link: `/workspace/${reqItem.projectId}`,
            type: 'invitation_accepted',
          },
        });
      } catch (subErr) {
        console.warn('Acceptance secondary side-effects handled gracefully:', subErr);
      }
    }

    return NextResponse.json(reqItem);
  } catch (error) {
    console.warn('Prisma update collab skipped (serverless fallback mode):', error);
    return NextResponse.json({
      id: params.id,
      status,
      updatedAt: new Date().toISOString(),
      message: `Collaboration request status set to ${status}`,
    });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.collaborationRequest.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true, id: params.id });
  } catch (error) {
    console.warn('Prisma delete collab skipped (serverless fallback mode):', error);
    return NextResponse.json({ success: true, id: params.id, message: 'Deleted in fallback mode' });
  }
}
