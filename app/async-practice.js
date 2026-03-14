async function fetchThreat(cveId) {
    try {
      const response = await fetch(
        `https://services.nvd.nist.gov/rest/json/cves/2.0?cveId=${cveId}`
      );
  
      // Check if HTTP request itself failed
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
  
      const data = await response.json();
  
      // Check if CVE actually exists in the database
      if (data.totalResults === 0) {
        throw new Error(`CVE not found: ${cveId}`);
      }
  
      const cve = data.vulnerabilities[0].cve;
  
      return {
        id: cve.id,
        description: cve.descriptions[0].value,
        score: cve.metrics.cvssMetricV31[0].cvssData.baseScore,
        severity: cve.metrics.cvssMetricV31[0].cvssData.baseSeverity,
        attackVector: cve.metrics.cvssMetricV31[0].cvssData.attackVector,
        published: cve.published.split('T')[0],
        cisaDeadline: cve.cisaActionDue || 'Not CISA listed',
      };
  
    } catch (error) {
      // If anything goes wrong, log it and return null
      console.error(`Failed to fetch ${cveId}:`, error.message);
      return null;
    }
  }
  
  // Fetch multiple CVEs at once — Promise.all runs them in parallel
  async function fetchMultiple(cveIds) {
    console.log(`Fetching ${cveIds.length} CVEs...\n`);
  
    const results = await Promise.all(
      cveIds.map(id => fetchThreat(id))
    );
  
    // Filter out any nulls (failed fetches)
    const successful = results.filter(r => r !== null);
  
    // Sort by score — highest risk first
    successful.sort((a, b) => b.score - a.score);
  
    console.log('=== THREAT REPORT ===');
    successful.forEach(cve => {
      console.log(`${cve.severity.padEnd(10)} ${cve.score}  ${cve.id}  ${cve.cisaDeadline}`);
    });
  
    console.log(`\n${successful.length}/${cveIds.length} fetched successfully`);
  }
  
  // Real Fortinet CVEs — your domain knowledge right there
  fetchMultiple([
    'CVE-2024-21762',
    'CVE-2023-27997',
    'CVE-2024-23113',
    'CVE-FAKE-00000',   // this one will fail — testing error handling
  ]);