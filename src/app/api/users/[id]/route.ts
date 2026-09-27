import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { calculatePairMatchScore } from '@/lib/matchingAlgorithm';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: params.id },
      include: {
        skills: {
          include: { skill: true },
        },
        ownedProjects: {
          include: { skills: { include: { skill: true } }, members: true },
        },
        projectMembers: {
          include: {
            project: {
              include: {
                skills: { include: { skill: true } },
                owner: true,
                members: { include: { user: true } },
              },
            },
          },
        },
        posts: {
          include: { comments: true, likes: true },
          orderBy: { createdAt: 'desc' },
        },
        notifications: {
          orderBy: { createdAt: 'desc' },
        },
        receivedCollab: {
          include: {
            project: {
              include: {
                skills: { include: { skill: true } },
              },
            },
            sender: {
              include: {
                skills: { include: { skill: true } },
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        sentCollab: {
          include: {
            project: {
              include: {
                skills: { include: { skill: true } },
              },
            },
            receiver: {
              include: {
                skills: { include: { skill: true } },
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Attach calculated matchScore to each collaboration request
    const enrichedReceivedCollab = user.receivedCollab.map((rc) => {
      const score = calculatePairMatchScore(user, {
        domain: rc.project.domain,
        skills: rc.project.skills,
        interests: rc.sender.interests,
        availability: rc.sender.availability,
      });
      return {
        ...rc,
        matchScore: score,
      };
    });

    const enrichedSentCollab = user.sentCollab.map((sc) => {
      const score = calculatePairMatchScore(sc.receiver, {
        domain: sc.project.domain,
        skills: sc.project.skills,
        interests: user.interests,
        availability: user.availability,
      });
      return {
        ...sc,
        matchScore: score,
      };
    });

    return NextResponse.json({
      ...user,
      receivedCollab: enrichedReceivedCollab,
      sentCollab: enrichedSentCollab,
    });
  } catch (error) {
    console.error('Error fetching user', error);
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const data = await req.json();
    const updated = await prisma.user.update({
      where: { id: params.id },
      data: {
        name: data.name,
        avatarUrl: data.avatarUrl,
        headline: data.headline,
        bio: data.bio,
        college: data.college,
        course: data.course,
        department: data.department,
        year: data.year ? parseInt(data.year) : undefined,
        availability: data.availability,
        interests: data.interests,
        githubUrl: data.githubUrl,
        portfolioUrl: data.portfolioUrl,
        linkedinUrl: data.linkedinUrl,
      },
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating user', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}
