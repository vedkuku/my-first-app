//this is server component - no 'use client' needed
//It fetches data on server and send readymade html to browser
//Notice: no useState, no useEffect - server components can fetch directly

import Link from 'next/link';

async function getThreats(keyword: string) {
  const response = await fetch(
    `https://services.nvd.nist.gov/rest/json/cves/2.0?keywordSearch=${keyword}&resultsPerPage=5`,
    { next: { revalidate: 3600 } }
  );
  const data = await response.json();
  return data.vulnerabilities || [];
}

export default async function Dashboard() {
  const vulnerabilities = await getThreats('fortinet');

  // Count critical and high using both CVSS versions
  const critical = vulnerabilities.filter((v: any) => {
    const s = v.cve.metrics?.cvssMetricV31?.[0]?.cvssData?.baseSeverity
           || v.cve.metrics?.cvssMetricV2?.[0]?.cvssData?.baseSeverity;
    return s === 'CRITICAL' || s === 'HIGH';
  }).length;

  const high = vulnerabilities.filter((v: any) => {
    const score = v.cve.metrics?.cvssMetricV31?.[0]?.cvssData?.baseScore
               || v.cve.metrics?.cvssMetricV2?.[0]?.cvssData?.baseScore || 0;
    return score >= 7.0;
  }).length;

  return (
    <main className="min-h-screen bg-[#07090F] p-10">

      {/* Header row */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">
          Security Dashboard
        </h1>
        <Link href="/"
          className="text-indigo-400 text-sm hover:text-indigo-300 transition-colors">
          ← Back to Search
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {[
          { label: 'Total CVEs', value: vulnerabilities.length, color: 'text-indigo-400' },
          { label: 'Score 7+', value: high, color: 'text-orange-400' },
          { label: 'Critical', value: critical, color: 'text-red-400' },
        ].map(stat => (
          <div key={stat.label}
            className="bg-[#0E1117] border border-[#1E2636] rounded-xl p-5">
            <div className={`text-4xl font-bold ${stat.color}`}>
              {stat.value}
            </div>
            <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* CVE list */}
      <div className="flex flex-col gap-3">
        {vulnerabilities.map((v: any) => {
          const cve = v.cve;
          const score = cve.metrics?.cvssMetricV31?.[0]?.cvssData?.baseScore
                     || cve.metrics?.cvssMetricV2?.[0]?.cvssData?.baseScore
                     || 'N/A';
          const isHigh = Number(score) >= 7.0;

          return (
            <div key={cve.id}
              className="bg-[#0E1117] border border-[#1E2636] rounded-xl p-4 flex items-center justify-between hover:border-indigo-500 transition-colors">

              {/* Left — CVE info */}
              <div className="flex-1 min-w-0">
                <div className="font-mono text-indigo-400 text-sm">
                  {cve.id}
                </div>
                <div className="text-gray-500 text-xs mt-1 truncate">
                  {cve.descriptions?.[0]?.value?.substring(0, 90)}...
                </div>
              </div>

              {/* Right — score badge */}
              <div className={`ml-4 px-3 py-1 rounded-full text-xs font-bold flex-shrink-0 ${
                isHigh
                  ? 'bg-red-500/10 border border-red-500/30 text-red-400'
                  : 'bg-yellow-500/10 border border-yellow-500/30 text-yellow-400'
              }`}>
                {score}
              </div>
            </div>
          );
        })}
      </div>

    </main>
  );
}