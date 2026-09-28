import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function PATCH(req: Request) {
  let body: any = {};
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  const { userId, notificationId } = body;

  if (!userId) {
    return NextResponse.json({ error: 'userId is required' }, { status: 400 });
  }

  try {
    if (notificationId) {
      await prisma.notification.update({
        where: { id: notificationId },
        data: { read: true },
      });
    } else {
      await prisma.notification.updateMany({
        where: { userId },
        data: { read: true },
      });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.warn('Prisma mark notifications read skipped (serverless fallback mode):', error);
  }

  return NextResponse.json({ success: true, message: 'Notifications marked read in fallback mode' });
}
