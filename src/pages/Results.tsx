import { useEffect, useState } from "react";

import {API_URL,SERVER_URL} from "../config/api";

type Result = {
  id: number;
  fullname: string;
  photo?: string;
  title?: string;
  total_votes: number;
};

export default function Results() {
  const [results, setResults] = useState<Result[]>([]);

  useEffect(() => {
    fetch(`${API_URL}/votes/results`)
      .then((res) => res.json())
      .then(setResults)
      .catch(console.error);
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-8 text-center text-4xl font-bold text-white">
          Election Results
        </h1>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {results.map((candidate) => {
            const imageUrl =
              `${SERVER_URL}${candidate.photo}`;

            return (
              <div
                key={candidate.id}
                className="rounded-2xl bg-slate-800 p-5 shadow-xl"
              >


<div className="p-5 bg-gray-800 rounded-lg shadow-md">
  <img
    src={imageUrl}
    alt={candidate.fullname}
    className="w-full h-48 object-cover rounded-t-lg mb-4"
  />
</div>



                <h2 className="text-2xl font-bold text-white">
                  {candidate.fullname}
                </h2>

                <p className="mt-1 text-cyan-400">
                  {candidate.title}
                </p>

                <p className="mt-4 text-xl font-bold text-green-400">
                  {candidate.total_votes} Votes
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
