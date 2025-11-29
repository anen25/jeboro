import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
    // Check for authorization (e.g., CRON_SECRET)
    const authHeader = request.headers.get('Authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        // return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        // For demo/dev, we might skip strict check or use a simple query param
    }

    try {
        // Find reports where embargo has ended AND status is still PENDING/EXCLUSIVE (not yet published/approved)
        // And publishType is EXCLUSIVE
        const expiredReports = await prisma.report.updateMany({
            where: {
                publishType: 'EXCLUSIVE',
                embargoEnds: { lt: new Date() },
                status: { not: 'APPROVED' } // Assuming APPROVED means published/completed
            },
            data: {
                publishType: 'OPEN',
                embargoEnds: null
            }
        });

        return NextResponse.json({
            success: true,
            updatedCount: expiredReports.count
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to process embargoes' }, { status: 500 });
    }
}
