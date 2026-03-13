export default async function Home() {

  const response = await fetch(
    "https://services.nvd.nist.gov/rest/json/cves/2.0?resultsPerPage=5"
  );

  const data = await response.json();
  const cves = data.vulnerabilities;

  function getSeverity(score:number) {

    if (score >= 9) return "Critical";
    if (score >= 7) return "High";
    if (score >= 4) return "Medium";

    return "Low";
  }

  return (
    <main className="p-10">

      <h1 className="text-3xl font-bold mb-6">
        Ved's AI Cyber Lab
      </h1>

      <div className="space-y-4">

        {cves.slice(0,5).map((cve:any, index:number) => {

const score =
cve.cve.metrics?.cvssMetricV31?.[0]?.cvssData?.baseScore ||
cve.cve.metrics?.cvssMetricV30?.[0]?.cvssData?.baseScore ||
cve.cve.metrics?.cvssMetricV2?.[0]?.cvssData?.baseScore;
          const severity =
            score ? getSeverity(score) : "Unknown";

          return (

            <div key={index} className="p-4 border rounded-lg">

              <h2 className="font-semibold text-lg">
                {cve.cve.id}
              </h2>

              <p className="text-sm mt-2">
                {cve.cve.descriptions?.find((d:any)=>d.lang==="en")?.value || "No description"}
              </p>

              <p className="mt-2 font-medium">
                Severity: {severity}
              </p>

              <p className="text-sm">
              CVSS Score: {score ?? "N/A"}
              </p>

            </div>

          );

        })}

      </div>

    </main>
  );
}