export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black font-sans">
      <main className="flex min-h-screen w-full max-w-4xl flex-col items-center justify-start py-16 px-6 bg-black">
        <h1 className="mb-12 text-4xl font-bold tracking-tight text-zinc-50 text-center">
          Ved&apos;s AI Cyber Lab
        </h1>
        <div className="grid grid-cols-1 gap-8 w-full max-w-3xl sm:grid-cols-3">
          {/* Critical Threats Card */}
          <div className="rounded-2xl bg-zinc-900 border border-zinc-800 shadow-lg p-8 flex flex-col items-center">
            <span className="text-2xl font-semibold text-red-500 mb-4">
              Critical Threats
            </span>
            <span className="text-4xl font-bold text-zinc-50">7</span>
            <p className="mt-2 text-sm text-zinc-400 text-center">
              Immediate action required
            </p>
          </div>
          {/* Active CVEs Card */}
          <div className="rounded-2xl bg-zinc-900 border border-zinc-800 shadow-lg p-8 flex flex-col items-center">
            <span className="text-2xl font-semibold text-yellow-400 mb-4">
              Active CVEs
            </span>
            <span className="text-4xl font-bold text-zinc-50">23</span>
            <p className="mt-2 text-sm text-zinc-400 text-center">
              Review official advisories
            </p>
          </div>
          {/* Firewall Alerts Card */}
          <div className="rounded-2xl bg-zinc-900 border border-zinc-800 shadow-lg p-8 flex flex-col items-center">
            <span className="text-2xl font-semibold text-blue-400 mb-4">
              Firewall Alerts
            </span>
            <span className="text-4xl font-bold text-zinc-50">14</span>
            <p className="mt-2 text-sm text-zinc-400 text-center">
              Check recent access logs
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
