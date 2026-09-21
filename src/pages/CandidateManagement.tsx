import { useEffect, useState } from "react";
import {API_URL, SERVER_URL} from "../config/api";



type Position = {
  id: number;
  title: string;
};

type Candidate = {
  id: number;
  fullname: string;
  bio?: string;
  photo?: string;
  title?: string;
};

export default function CandidateManagement() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);

  const [fullname, setFullname] = useState("");
  const [bio, setBio] = useState("");
  const [positionId, setPositionId] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);

  const loadCandidates = async () => {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `${API_URL}/candidates`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();
    setCandidates(data);
  };

  const loadPositions = async () => {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `${API_URL}/positions`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();
    setPositions(data);
  };

  useEffect(() => {
    loadCandidates();
    loadPositions();
  }, []);

  const createCandidate = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    const formData = new FormData();

    formData.append("fullname", fullname);
    formData.append("bio", bio);
    formData.append("position_id", positionId);

    if (photo) {
      formData.append("photo", photo);
    }

    const response = await fetch(
      `${API_URL}/candidates`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.message);
      return;
    }

    setFullname("");
    setBio("");
    setPositionId("");
    setPhoto(null);

    loadCandidates();
  };

  const deleteCandidate = async (
    id: number
  ) => {
    if (
      !window.confirm(
        "Delete this candidate?"
      )
    ) {
      return;
    }

    const token = localStorage.getItem("token");

    const response = await fetch(
      `${API_URL}/candidates/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    alert(data.message);

    loadCandidates();
  };

  return (
    <div className="min-h-screen bg-slate-900 p-6 text-white">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-8 text-4xl font-bold">
          Candidate Management
        </h1>

        <div className="mb-8 rounded-2xl bg-slate-800 p-6 shadow-xl">
          <h2 className="mb-4 text-2xl font-bold">
            Add Candidate
          </h2>

          <form
            onSubmit={createCandidate}
            className="space-y-4"
          >
            <input
              type="text"
              placeholder="Full Name"
              value={fullname}
              onChange={(e) =>
                setFullname(e.target.value)
              }
              className="w-full rounded-lg border border-slate-600 bg-slate-700 p-3"
              required
            />

            <textarea
              placeholder="Biography"
              value={bio}
              onChange={(e) =>
                setBio(e.target.value)
              }
              className="w-full rounded-lg border border-slate-600 bg-slate-700 p-3"
              rows={4}
            />

            <select
              value={positionId}
              onChange={(e) =>
                setPositionId(e.target.value)
              }
              className="w-full rounded-lg border border-slate-600 bg-slate-700 p-3"
              required
            >
              <option value="">
                Select Position
              </option>

              {positions.map((position) => (
                <option
                  key={position.id}
                  value={position.id}
                >
                  {position.title}
                </option>
              ))}
            </select>

            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setPhoto(
                  e.target.files?.[0] || null
                )
              }
              className="w-full rounded-lg border border-slate-600 bg-slate-700 p-3"
            />

            <button
              type="submit"
              className="rounded-lg bg-green-600 px-6 py-3 font-semibold hover:bg-green-700"
            >
              Add Candidate
            </button>
          </form>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {candidates.map((candidate) => {
            const imageUrl =
              `${SERVER_URL}${candidate.photo || ""}`;

            return (
              <div
                key={candidate.id}
                className="overflow-hidden rounded-2xl bg-slate-800 shadow-xl"
              >
                {candidate.photo && (
                  <img
                    src={imageUrl}
                    alt={candidate.fullname}
                    className="h-56 w-full object-cover"
                  />
                )}

                <div className="p-5">
                  <h2 className="text-2xl font-bold">
                    {candidate.fullname}
                  </h2>

                  {candidate.title && (
                    <p className="mt-2 text-cyan-400">
                      {candidate.title}
                    </p>
                  )}

                  {candidate.bio && (
                    <p className="mt-4 text-slate-300">
                      {candidate.bio}
                    </p>
                  )}

                  <button
                    onClick={() =>
                      deleteCandidate(
                        candidate.id
                      )
                    }
                    className="mt-4 w-full rounded-lg bg-red-600 py-3 font-semibold hover:bg-red-700"
                  >
                    Delete Candidate
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
``
