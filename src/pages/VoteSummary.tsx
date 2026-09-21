import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { API_URL} from "../config/api";

type VoteSummaryItem = {
  position: string;
  fullname: string;
  photo?: string;
  voted_at: string;
};

export default function VoteSummary() {
  const navigate = useNavigate();

  const [votes, setVotes] = useState<
    VoteSummaryItem[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const loadSummary = async () => {
      try {
        const token =
          localStorage.getItem("token");

        const response = await fetch(
          `${API_URL}/votes/summary`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data =
          await response.json();

        setVotes(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadSummary();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900">
        <h1 className="text-2xl font-bold text-white">
          Loading...
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 p-6 text-white">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-green-500">
              ✅ You Have Already Voted
            </h1>

            <p className="mt-2 text-slate-400">
              Thank you for participating in
              the election.
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-lg bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-700"
          >
            Logout
          </button>
        </div>

        {/* Vote Summary */}
        <div className="rounded-2xl bg-slate-800 p-6 shadow-xl">
          <h2 className="mb-6 text-2xl font-bold">
            My Ballot
          </h2>

          {votes.length === 0 ? (
            <p className="text-slate-400">
              No votes found.
            </p>
          ) : (
            <div className="space-y-4">
              {votes.map((vote, index) => {
                const imageUrl = vote.photo
                  ? `${API_URL}${vote.photo}`
                  : undefined;

                return (
                  <div
                    key={index}
                    className="flex items-center gap-4 rounded-xl bg-slate-900 p-4"
                  >

  <img
    src={imageUrl}
    alt={vote.fullname}
    className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-700 text-xl font-bold"
  />


                    <div>
                      <h3 className="text-lg font-bold text-cyan-400">
                        {vote.position}
                      </h3>

                      <p className="text-white">
                        {vote.fullname}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
``
