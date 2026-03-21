//this is server component - no 'use client' needed
//It fetches data on server and send readymade html to browser
//Notice: no useState, no useEffect - server components can fetch directly

import Link from 'next/link';


// Fetch happens on server at request time

async function getThreats(keyword: string) {
    const response = await fetch(
        `https://services.nvd.nist.gov/rest/json/cves/2.0?keywordSearch=${keyword}&resultsPerPage=5`,
        { next: {revalidate:3600}}
    )
    
    const data = await response.json();

    return data.vulnerabilities || [];


}

export default async function Dashboard() {

    //Direct await in server component - no useEffect needed
    const vulnerabilities = await getThreats('fortinet');

    return (
        <main style={{ padding: '40px', background: '#07090F', minHeight: '100vh' }}>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
        <h1 style={{ color: '#E8EDF5' }}>Security Dashboard</h1>
        {/* Link component — client-side navigation, no full page reload */}
        <Link href="/" style={{ color: '#818CF8', fontSize: '14px' }}>
          ← Back to Search
        </Link>
      </div>

      {/* Summary stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '32px' }}>
        
        {[
            { label: 'Total CVEs', value: vulnerabilities.length, color: '#818CF8' },
            { label: 'Critical', value: vulnerabilities.filter((v: any) => v.cve.metrics?.cvssMetricV31?.[0]?.cvssData?.baseSeverity === 'CRITICAL').length, color: '#EF4444' },
            { label: 'High', value: vulnerabilities.filter((v: any) => v.cve.metrics?.cvssMetricV31?.[0]?.cvssData?.baseSeverity === 'HIGH').length, color: '#F97316' },

        
        ].map(stat => (
            <div key={stat.label} style={{
              background: '#0E1117',
              border: '1px solid #1E2636',
              borderRadius: '12px',
              padding: '20px',
            }}>
              <div style={{ fontSize: '32px', fontWeight: 700, color: stat.color }}>{stat.value}</div>
              <div style={{ fontSize: '13px', color: '#7B8BA5', marginTop: '4px' }}>{stat.label}</div>
            </div>
          ))}
        </div>
  
        {/* CVE list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {vulnerabilities.map((v: any) => {
            const cve = v.cve;
            const score = cve.metrics?.cvssMetricV31?.[0]?.cvssData?.baseScore
                       || cve.metrics?.cvssMetricV2?.[0]?.cvssData?.baseScore
                       || 'N/A';
            return (
              <div key={cve.id} style={{
                background: '#0E1117',
                border: '1px solid #1E2636',
                borderRadius: '12px',
                padding: '14px 18px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <div>
                  <div style={{ fontFamily: 'monospace', color: '#818CF8', fontSize: '14px' }}>{cve.id}</div>
                  <div style={{ color: '#7B8BA5', fontSize: '12px', marginTop: '4px' }}>
                    {cve.descriptions?.[0]?.value?.substring(0, 80)}...
                  </div>
                </div>
                <div style={{
                  background: '#EF444422',
                  border: '1px solid #EF444444',
                  color: '#EF4444',
                  padding: '4px 12px',
                  borderRadius: '100px',
                  fontSize: '12px',
                  fontWeight: 600,
                  flexShrink: 0,
                  marginLeft: '16px',
                }}>
                  {score}
                </div>
              </div>
            );
          })}
        </div>
  
      </main>
    );
  
           
       


    
}