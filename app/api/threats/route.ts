// This runs on YOUR server — not in the browser
// Browser calls /api/threats → this calls NVD → returns data to browser
// CORS is only blocked browser-to-external — server-to-external is fine

import { NextResponse } from 'next/server';

export async function GET(request: Request) {

  // Get search keyword from URL e.g. /api/threats?keyword=fortinet
  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get('keyword') || 'fortinet';

  try {
    // This fetch runs on YOUR server — NVD allows it
    const response = await fetch(
      `https://services.nvd.nist.gov/rest/json/cves/2.0?keywordSearch=${keyword}&resultsPerPage=10`,
      { next: { revalidate: 3600 } } // cache for 1 hour — avoid hammering NVD
    );

    if (!response.ok) {
      throw new Error(`NVD API error: ${response.status}`);
    }

    const data = await response.json();
    //console.log('Raw API response:', JSON.stringify(data, null, 2));

    // Return raw data — page.tsx will parse it
    return NextResponse.json(data);

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}