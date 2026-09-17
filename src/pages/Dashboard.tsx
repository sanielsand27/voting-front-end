export default function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <h1 className="mb-6 text-4xl font-bold text-white">
        Dashboard
      </h1>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl bg-slate-800 p-6 text-white">
          Total Candidates
        </div>

        <div className="rounded-3xl bg-slate-800 p-6 text-white">
          Total Votes
        </div>

        <div className="rounded-3xl bg-slate-800 p-6 text-white">
          Positions
        </div>
      </div>
    </div>
  );
}
