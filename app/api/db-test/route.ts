import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Get /api/db-test - tests database connection
export async function GET() {
    try {
        // Count users in database - should be 0 since its empty

        const userCount = await prisma.user.count();
        const threatCount = await prisma.threat.count();

        return NextResponse.json({
            message: 'Database connected successfully',
            users: userCount,
            threats: threatCount,
        });
    } catch (error: any) {
        return NextResponse.json(
            {error: error.message },
            { status: 500 }
        );
    }
}