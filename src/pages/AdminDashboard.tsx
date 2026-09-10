import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

type Stats = {
  totalCandidates: number;
  totalVotes: number;
  totalPositions: number;
};

type PositionResult = {
  id: number;
  fullname: string;
  photo?: string;
  votes: number;
  position: string;
};

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState<Stats>({
    totalCandidates: 0,
    totalVotes: 0,
    totalPositions: 0,
  });

  const [positionResults, setPositionResults] =
    useState<PositionResult[]>([]);

  const [lastUpdated, setLastUpdated] =
    useState("");

  const loadStats = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://192.168.135.42:5006/api/admin/stats",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error(error);
    }
  };

  const loadPositionResults = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://192.168.135.42:5006/api/admin/position-results",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      setPositionResults(data);

      setLastUpdated(
        new Date().toLocaleTimeString()
      );
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const loadDashboard = async () => {
      await Promise.all([
        loadStats(),
        loadPositionResults(),
      ]);

      setLoading(false);
    };

    loadDashboard();

    const interval = setInterval(() => {
      loadStats();
      loadPositionResults();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  const groupedResults =
    positionResults.reduce<
      Record<string, PositionResult[]>
    >((acc, candidate) => {
      if (!acc[candidate.position]) {
        acc[candidate.position] = [];
      }

      acc[candidate.position].push(candidate);

      return acc;
    }, {});

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <h1 className="text-2xl font-bold text-white">
          Loading Dashboard...
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Navbar */}
      <div className="border-b border-slate-800 bg-slate-900">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <h1 className="text-3xl font-bold">
            Admin Dashboard
          </h1>

          <button
            onClick={handleLogout}
            className="rounded-lg bg-red-600 px-4 py-2 font-semibold hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl p-6">
        {/* Welcome */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold">
            Welcome Administrator
          </h2>

          <p className="text-slate-400">
            Monitor election performance,
            voters, positions and results.
          </p>
        </div>

        {/* Stats */}
        <div className="mb-10 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl bg-slate-800 p-6 shadow-xl">
            <p className="text-slate-400">
              Total Candidates
            </p>

            <h2 className="mt-2 text-5xl font-bold text-cyan-400">
              {stats.totalCandidates}
            </h2>
          </div>

          <div className="rounded-2xl bg-slate-800 p-6 shadow-xl">
            <p className="text-slate-400">
              Total Votes
            </p>

            <h2 className="mt-2 text-5xl font-bold text-green-400">
              {stats.totalVotes}
            </h2>
          </div>

          <div className="rounded-2xl bg-slate-800 p-6 shadow-xl">
            <p className="text-slate-400">
              Total Positions
            </p>

            <h2 className="mt-2 text-5xl font-bold text-yellow-400">
              {stats.totalPositions}
            </h2>
          </div>
        </div>

        {/* Navigation Cards */}
        <div className="mb-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Link
            to="/candidates-manage"
            className="rounded-2xl bg-slate-800 p-6 shadow-xl transition hover:bg-slate-700"
          >
            <h3 className="text-xl font-bold">
              Candidates
            </h3>
            <p className="mt-2 text-slate-400">
              Manage candidates
            </p>
          </Link>

          <Link
            to="/positions"
            className="rounded-2xl bg-slate-800 p-6 shadow-xl transition hover:bg-slate-700"
          >
            <h3 className="text-xl font-bold">
              Positions
            </h3>
            <p className="mt-2 text-slate-400">
              Manage positions
            </p>
          </Link>

          <Link
            to="/voters"
            className="rounded-2xl bg-slate-800 p-6 shadow-xl transition hover:bg-slate-700"
          >
            <h3 className="text-xl font-bold">
              Voters
            </h3>
            <p className="mt-2 text-slate-400">
              Manage voter accounts
            </p>
          </Link>

          <Link
            to="/results"
            className="rounded-2xl bg-slate-800 p-6 shadow-xl transition hover:bg-slate-700"
          >
            <h3 className="text-xl font-bold">
              Results
            </h3>
            <p className="mt-2 text-slate-400">
              View results
            </p>
          </Link>
        </div>

        {/* Live Results */}
        <div className="rounded-2xl bg-slate-800 p-6 shadow-xl">
          <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <h2 className="text-2xl font-bold">
              Live Election Results
            </h2>

            <span className="text-sm text-slate-400">
              Last Updated: {lastUpdated}
            </span>
          </div>

          {Object.entries(groupedResults).map(
            ([position, candidates]) => {
              const sortedCandidates = [
                ...candidates,
              ].sort(
                (a, b) => b.votes - a.votes
              );

              const totalVotes =
                sortedCandidates.reduce(
                  (sum, candidate) =>
                    sum + candidate.votes,
                  0
                );

              const leaderVotes =
                sortedCandidates[0]?.votes || 0;

              return (
                <div
                  key={position}
                  className="mb-10"
                >
                  <h3 className="mb-6 text-xl font-bold text-cyan-400">
                    {position}
                  </h3>

                  {sortedCandidates.map(
                    (candidate) => {
                      const percentage =
                        totalVotes > 0
                          ? (
                              (candidate.votes /
                                totalVotes) *
                              100
                            ).toFixed(1)
                          : "0";

                      const imageUrl =
                        candidate.photo
                          ? `http://192.168.135.42:5006${candidate.photo}`
                          : "";

                      const isLeader =
                        candidate.votes ===
                          leaderVotes &&
                        leaderVotes > 0;

                      return (
                        <div
                          key={candidate.id}
                          className={`mb-5 rounded-2xl p-4 ${
                            isLeader
                              ? "border border-yellow-500 bg-slate-900"
                              : "bg-slate-900"
                          }`}
                        >
                          {isLeader && (
                            <div className="mb-3">
                              <span className="rounded-full bg-yellow-500 px-3 py-1 text-xs font-bold text-black">
                                🏆 LEADING
                              </span>
                            </div>
                          )}

<div className="flex items-center gap-4">
{candidate.photo && ( 

 <img
    src={imageUrl}
    alt={candidate.fullname}
    className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-700 text-xl font-bold"
  />
)}




                            <div className="flex-1">
                              <div className="mb-2 flex justify-between">
                                <div>
                                  <h4 className="font-bold">
                                    {
                                      candidate.fullname
                                    }
                                  </h4>

                                  <p className="text-sm text-slate-400">
                                    {
                                      candidate.votes
                                    }{" "}
                                    vote
                                    {candidate.votes !==
                                    1
                                      ? "s"
                                      : ""}
                                  </p>
                                </div>

                                <span className="font-bold text-cyan-400">
                                  {percentage}%
                                </span>
                              </div>

                              <div className="h-5 overflow-hidden rounded-full bg-slate-700">
                                <div
                                  className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 transition-all duration-700"
                                  style={{
                                    width: `${percentage}%`,
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              );
            }
          )}
        </div>
      </div>
    </div>
  );
}
``
