import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

export const runtime = 'edge';

const prisma = new PrismaClient();

const reportSchema = z.object({
  title: z.string().min(2),
  content: z.string().min(10),
  category: z.string(),
  region: z.string().optional(),
  publishType: z.enum(['OPEN', 'EXCLUSIVE']),
  isAnonymous: z.boolean(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = reportSchema.parse(body);

    // TODO: Get authenticated user. For now, we might need a dummy user or require auth.
    // The prompt says "Social Login... User Registration".
    // If not logged in, maybe allow anonymous submission but we need an authorId.
    // Or create a temporary user?
    // The schema requires authorId.
    // For MVP, let's assume the user is logged in or we use a default "Anonymous" user if allowed.
    // But better-auth should handle session.

    // For now, let's just find the first user or create one if none exists (for testing).
    let user = await prisma.user.findFirst();
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: 'test@example.com',
          provider: 'GOOGLE', // Dummy
          role: 'INFORMANT'
        }
      });
    }

    const report = await prisma.report.create({
      data: {
        title: validatedData.title,
        content: validatedData.content,
        publishType: validatedData.publishType,
        region: validatedData.region,
        status: 'PENDING',
        authorId: user.id,
        embargoEnds: validatedData.publishType === 'EXCLUSIVE' ? new Date(Date.now() + 48 * 60 * 60 * 1000) : null,
      },
    });

    return NextResponse.json(report, { status: 201 });
  } catch (error) {
    console.error('Failed to create report:', error);
    return NextResponse.json({ error: 'Failed to create report' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const publishType = searchParams.get('publishType');

  const where: any = {};
  if (status) where.status = status;
  if (publishType) where.publishType = publishType;

  const reports = await prisma.report.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: { author: { select: { name: true, email: true } } }
  });

  return NextResponse.json(reports);
}
