'use client';

//useState - manages search term and fetched threats
//useEffect - runs fetch when search term changes

import {useState, useEffect } from 'react';
import ThreatCard from './components/ThreatCard';

//Blueprint for CVE objects coming from NVD API

interface Threat {
  id: string;
  score: number;
  severity: 'critical' | 'high' | 'medium' | 'low';
  vendor: string;
  patched: boolean;

}

//Helper - convert raw NVD api response into our clean Threat shape

function parseNVDResponse(vulnerabilities: any[]): Threat[] {
  return vulnerabilities
    .map(v => {
      const cve = v.cve;

      // Try V31 first, fall back to V2 for older CVEs
      const cvss31 = cve.metrics?.cvssMetricV31?.[0]?.cvssData;
      const cvss2  = cve.metrics?.cvssMetricV2?.[0]?.cvssData;
      const cvss   = cvss31 || cvss2;

      // Skip if no CVSS data at all
      if (!cvss) return null;

     // CVSS V2 severity thresholds are different from V3
// V2: 0-3.9 Low, 4-6.9 Medium, 7-10 High (no Critical in V2)
const getSeverity = (score: number, baseSeverity: string): Threat['severity'] => {
  const s = baseSeverity?.toUpperCase();
  if (s === 'CRITICAL') return 'critical';
  if (s === 'HIGH') return 'high';
  if (s === 'MEDIUM' || s === 'MODERATE') return 'medium';
  // V2 fallback — use score directly
  if (score >= 7.0) return 'high';
  if (score >= 4.0) return 'medium';
  return 'low';
};

// Then replace the severity line in the return object:


      // Extract vendor from descriptions as fallback
      const description = cve.descriptions?.[0]?.value || '';
      const vendor = description.split(' ').slice(0, 3).join(' ');

      return {
        id: cve.id,
        score: cvss.baseScore,
        severity: getSeverity(cvss.baseScore, cvss.baseSeverity),
        vendor: vendor,
        patched: false,
      };
    })
    .filter(Boolean) as Threat[];
}

export default function home() {
  //searchTerm - what user typed in search box

  const [searchTerm, setSearchTerm] = useState('fortinet');

  //threats - live CVE data fetched from NVD

  const [threats, setThreats] = useState<Threat[]>([]);

  //loading - controls wheather we show a loading message
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null >(null);

  // activeFilter — tracks which severity button is selected
// 'all' means show everything
const [activeFilter, setActiveFilter] = useState<string>('all');

  //useEffect - runs fetch everytime searchterm changes
  //[searchTerm] in dependency arragy = re-run when searchTerm changes
  // Replace the useEffect with this debounced version
useEffect(() => {
  if (!searchTerm.trim()) return;

  // Wait 500ms after user stops typing before fetching
  // This prevents firing on every single keystroke
  const timer = setTimeout(() => {
    async function fetchThreats() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/threats?keyword=${searchTerm}`
        );
        if (!response.ok) throw new Error(`API error: ${response.status}`);

        const data = await response.json();
        const parsed = parseNVDResponse(data.vulnerabilities || []);
        parsed.sort((a, b) => b.score - a.score);
        setThreats(parsed);

      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchThreats();
  }, 500); // wait 500ms after last keystroke

  // Cleanup — cancel previous timer if user types again
  return () => clearTimeout(timer);

}, [searchTerm]);

// filteredThreats — derived from threats based on activeFilter
// no API call needed — just filters already-fetched data
const filteredThreats = activeFilter === 'all'
  ? threats
  : threats.filter(t => t.severity === activeFilter);

return (
  <main style={{ padding: '40px', background: '#07090F', minHeight: '100vh' }}>

    {/* Header */}
    <h1 className="text-3xl font-bold text-white mb-2">
      Threat Dashboard
    </h1>

    {/* Search box — updates searchTerm on every keystroke */}
    <input
      type="text"
      value={searchTerm}
      onChange={e => setSearchTerm(e.target.value)}
      placeholder="Search CVEs e.g. fortinet, cisco, apache..."
      style={{
        width: '100%',
        padding: '10px 16px',
        background: '#0E1117',
        border: '1px solid #1E2636',
        borderRadius: '10px',
        color: '#E8EDF5',
        fontSize: '14px',
        marginBottom: '16px',
        outline: 'none',
      }}
    />

    {/* Filter buttons — each sets activeFilter state on click */}
    <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
      {['all', 'critical', 'high', 'medium', 'low'].map(t => (
        <button
          key={t}
          onClick={() => setActiveFilter(t)}
          style={{
            padding: '6px 14px',
            borderRadius: '8px',
            border: `1px solid ${activeFilter === t ? '#6366F1' : '#1E2636'}`,
            background: activeFilter === t ? '#6366F122' : 'none',
            color: activeFilter === t ? '#818CF8' : '#7B8BA5',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 600,
            textTransform: 'capitalize',
          }}
        >
          {t}
        </button>
      ))}
    </div>

    {/* Status line */}
    <p style={{ color: '#7B8BA5', marginBottom: '24px', fontSize: '13px' }}>
      {loading && 'Fetching from NVD...'}
      {error && `Error: ${error}`}
      {!loading && !error && `${filteredThreats.length} of ${threats.length} threats shown`}
    </p>

    {/* Threat cards — uses filteredThreats not threats */}
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {filteredThreats.map(t => (
        <ThreatCard key={t.id} cveData={t} />
      ))}
    </div>

  </main>
);
    }
 
