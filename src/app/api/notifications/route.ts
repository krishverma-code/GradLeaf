import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { FALLBACK_USERS } from '@/lib/fallbackData';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'userId is required' }, { status: 400 });
  }

  try {
    const notifs = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
    if (notifs && notifs.length > 0) {
      return NextResponse.json(notifs);
    }
  } catch (err) {
    console.warn('Prisma get notifications fallback mode:', err);
  }

  const fallbackUser = FALLBACK_USERS.find((u) => u.id === userId);
  return NextResponse.json(fallbackUser?.notifications || []);
}

export async function POST(req: Request) {
  let body: any = {};
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  const { userId, title, message, link, type } = body;
  if (!userId || !title) {
    return NextResponse.json({ error: 'userId and title are required' }, { status: 400 });
  }

  try {
    const created = await prisma.notification.create({
      data: {
        userId,
        title,
        message: message || '',
        link: link || null,
        type: type || 'invitation',
        read: false,
      },
    });
    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    console.warn('Prisma create notification fallback:', err);
  }

  return NextResponse.json(
    {
      id: 'notif_' + Date.now().toString(36),
      userId,
      title,
      message: message || '',
      link: link || null,
      type: type || 'invitation',
      read: false,
      createdAt: new Date().toISOString(),
    },
    { status: 201 }
  );
}

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
