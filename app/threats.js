//export = make this available for other file
export const NVD_BASE_URL = 'https://services.nvd.nist.gov/rest/json/cves/2.0';
export function fetchThreat(cveId) {
    /*response = await fetch(`https://services.nvd.nist.gov/rest/json/cves/2.0?cveId=${cveId}`);

    data = response.jason();
    const cve = data.vulnerabilities[0].cve; */
    
    //another way of writing above code

    return fetch(`https://services.nvd.nist.gov/rest/json/cves/2.0?cveId=${cveId}`)
    .then(res => res.json())
    .then(data => {
        const cve = data.vulnerabilities[0].cve;
    return {
        id: cve.id,
        score: cve.metrics.cvssMetricV31[0].cvssData.baseScore,
        severity: cve.metrics.cvssMetricV31[0].cvssData.baseSeverity,
    };
    });
}

// export a constant too

//export  NVD_BASE_URL;