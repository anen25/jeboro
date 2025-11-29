import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { auth } from '@/lib/auth'; // Import from our auth lib
import { headers } from 'next/headers';

export const runtime = 'edge';

const prisma = new PrismaClient();

export async function GET(request: Request) {
    // better-auth session retrieval
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: { reputation: true }
    });

    return NextResponse.json(user);
}
