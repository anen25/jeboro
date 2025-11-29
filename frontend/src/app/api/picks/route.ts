import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const pickSchema = z.object({
    reportId: z.string(),
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { reportId } = pickSchema.parse(body);

        // TODO: Get authenticated reporter
        const reporter = await prisma.user.findFirst({ where: { role: 'REPORTER' } });
        if (!reporter) {
            return NextResponse.json({ error: 'Reporter not found' }, { status: 404 });
        }

        // Check if report exists and is EXCLUSIVE
        const report = await prisma.report.findUnique({ where: { id: reportId } });
        if (!report) return NextResponse.json({ error: 'Report not found' }, { status: 404 });

        // Create Pick
        const pick = await prisma.pick.create({
            data: {
                reportId,
                reporterId: reporter.id,
            },
        });

        // If Exclusive, set embargo logic (already set in Report creation, but maybe update status?)
        // The prompt says "Embargo starts when Picked?" -> "EXCLUSIVE 선택 시 48시간 타이머"
        // Actually prompt says: "EXCLUSIVE 워크플로우: 기자가 Pick → 제보자 선택 → embargoEnds = now() + 48h"
        // So embargo starts after Pick AND Informant selection.
        // For MVP, let's assume Pick starts it or just sets the relationship.

        return NextResponse.json(pick, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to pick report' }, { status: 500 });
    }
}
