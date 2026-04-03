import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server'; // get logged-in user's id
import { prisma } from '../../../lib/prisma'; //your Prisma singleton

//Get /api/saved-threats - fetch all saved threats from database
export async function GET() {
    try {
        const { userId } = await auth();  //get real userId from Clerk session

        //if not logged in, return 401 aunauthorised
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorised'}, { status: 401 });
        }
         //findMany returns all rows in Threat table as an array
        const threats = await prisma.threat.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }, //newest first
        });

        return NextResponse.json(threats);

    } catch (error: any) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}


//POST /api/saved-threats - save one CVE to database

export async function POST(request: Request) {
    try {
        const { userId } = await auth();  //get real userId from Clerk session

// if not logged in, reject the save attempt
        if (!userId) {
            return NextResponse.json({ error: 'Unathorised'}, { status: 401 });
        }

        //Parse the JSON body sent from ThreatCard
        const body = await request.json();

        //create() inserts one new row into Threat table

        const saved = await prisma.threat.create({
            data: {
                cveId:       body.cveId,
                score:       body.score,
                severity:    body.severity,
                vendor:      body.vendor,
                description: body.description,
                patched:     false,     //always starts unpatched
                userId                  //real Clerk userid - no longer hardcoded

            },
        });

       //Return the saved row - ThreatCard will use this to confirm save

       return NextResponse.json(saved, { status: 201 });

    } catch (error: any) {
        console.log('POST error:', error.message);
        return NextResponse.json(
            { error: error.message},
            { status: 500 }
        );
    }
}