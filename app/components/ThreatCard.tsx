// 'use client' = this component runs in the browser
// needed because we will add onClick interactivity

'use client';

import { useState } from 'react';

//Bleprint for what a CVE object looks like

interface Threat {
    id: string;
    score: number;
    severity: 'critical' | 'high' | 'medium' | 'low';
    vendor: string;
    patched: boolean;
}

// Blueprint for what this component accepts from its parent

interface ThreatCardProps {
    cveData: Threat;
}

// Color lookup for each severity level
const severityColors = {
    critical: '#EF4444',
    high: '#F97316',
    medium: '#FBBF24',
    low: '#10B981',
  };

  //cveData is the actual CVE object passed in from page.tsx
  export default function ThreatCard({ cveData}: ThreatCardProps) {

    //Controls wheather the details panel is visible or hidden
    const [expanded, setExpanded] = useState(false);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');



   // Track patched status locally - starting value with whatever comes from parent 
     const [patchedStatus, setPatchedStatus] = useState(cveData.patched);
   

  // Saves this CVE to the daabse via POST /api/saved-theats
  async function handleSave() {
    setSaveStatus('saving');
  
    try {
      const response = await fetch('/api/saved-threats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cveId:       cveData.id,          // id lives inside cveData
          score:       cveData.score,       // score lives inside cveData
          severity:    cveData.severity,    // severity lives inside cveData
          vendor:      cveData.vendor,      // vendor lives inside cveData
          description: cveData.id,          // no description prop yet — use id as placeholder
        }),
      });
  
      if (!response.ok) throw new Error('Save failed');
      setSaveStatus('saved');
  
    } catch (error) {
      setSaveStatus('error');
    }
  }
   return (
        <div style={{
            background: '#0E1117',
            border: '1px solid #1E2636',
            borderRadius: '12px',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>   
          {/* Top row — always visible */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
    
            {/* Left — CVE id and vendor */}
            <div>
              <div style={{ fontFamily: 'monospace', color: '#818CF8', fontSize: '14px' }}>
                {cveData.id}
              </div>
              <div style={{ color: '#7B8BA5', fontSize: '12px', marginTop: '4px' }}>
                {cveData.vendor} · {patchedStatus ? '✓ Patched' : '⚠ Unpatched'}
              </div>
            </div>
    
            {/* Right — severity badge + expand button */}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
    
              {/* Severity badge */}
              <div style={{
                background: severityColors[cveData.severity] + '22',
                border: `1px solid ${severityColors[cveData.severity]}44`,
                color: severityColors[cveData.severity],
                padding: '4px 12px',
                borderRadius: '100px',
                fontSize: '12px',
                fontWeight: 600,
              }}>
                {cveData.score} {cveData.severity}
              </div>
    
              {/* Toggles expanded true/false on each click */}
              <button
                onClick={() => setExpanded(!expanded)}
                style={{
                  background: 'none',
                  border: '1px solid #1E2636',
                  color: '#7B8BA5',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '12px',
                }}
              >
                {expanded ? '▲ Less' : '▼ More'}
              </button>
            </div>
          </div>
    
          {/* Details panel — only renders when expanded is true */}
          {expanded && (
            <div style={{
              marginTop: '14px',
              paddingTop: '14px',
              borderTop: '1px solid #1E2636',
            }}>
              <div style={{ color: '#7B8BA5', fontSize: '12px', marginBottom: '12px' }}>
                Severity: <span style={{ color: severityColors[cveData.severity] }}>
                  {cveData.severity.toUpperCase()}
                </span> · Score: {cveData.score} · Vendor: {cveData.vendor}
              </div>
    
              {/* Toggles patchedStatus true/false on each click */}
              <button
                onClick={() => setPatchedStatus(!patchedStatus)}
                style={{
                  background: patchedStatus ? '#10B98122' : '#6366F122',
                  border: `1px solid ${patchedStatus ? '#10B98144' : '#6366F144'}`,
                  color: patchedStatus ? '#10B981' : '#818CF8',
                  padding: '6px 14px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: 600,
                }}
              >
                {patchedStatus ? '✓ Mark as Unpatched' : '⚡ Mark as Patched'}
              </button>

              
            </div>
          )}

<button
  onClick={handleSave}
  disabled={saveStatus === 'saving' || saveStatus === 'saved'}
  className={`mt-2 px-3 py-1 rounded text-xs font-semibold transition-colors ${
    saveStatus === 'saved'  ? 'bg-green-700 text-green-100' :
    saveStatus === 'error'  ? 'bg-red-700 text-red-100' :
    saveStatus === 'saving' ? 'bg-gray-600 text-gray-300' :
    'bg-blue-700 text-white hover:bg-blue-600'
  }`}
>
  {saveStatus === 'saved'  ? 'Saved ✓' :
   saveStatus === 'error'  ? 'Failed — retry' :
   saveStatus === 'saving' ? 'Saving...' :
   'Save CVE'}
</button>
        </div>

        
      );
    }