import { useEffect, useState } from "react";

import {
  successAlert,
  confirmAlert
} from "../utils/alerts";


type Position = {
  id: number;
  title: string;
  max_votes: number;
};

export default function Positions() {
  const [positions, setPositions] = useState<
    Position[]
  >([]);

  const [title, setTitle] = useState("");

  const [maxVotes, setMaxVotes] =
    useState(1);

  const loadPositions = async () => {
    try {
      const token =
        localStorage.getItem("token");

      const response = await fetch(
        "http://192.168.135.42:5006/api/positions",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data =
        await response.json();

      setPositions(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadPositions();
  }, []);

  const addPosition = async () => {
    try {
      if (!title.trim()) {
        alert("Position title is required");
        return;
      }

      const token =
        localStorage.getItem("token");

      const response = await fetch(
        "http://192.168.135.42:5006/api/positions",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
            Authorization:
              `Bearer ${token}`,
          },
          body: JSON.stringify({
            title,
            max_votes: maxVotes,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
successAlert(
  "Success",
  data.message
);

        return;
      }

successAlert(
  "Success",
  data.message
);


      setTitle("");
      setMaxVotes(1);

      loadPositions();
    } catch (error) {
      console.error(error);
    }
  };

  const deletePosition = async (
    id: number
  ) => {
const result =
  await confirmAlert(
    "Delete Position?",
    "This action cannot be undone."
  );

if (!result.isConfirmed) return;

    try {
      const token =
        localStorage.getItem("token");

      const response = await fetch(
        `http://192.168.135.42:5006/api/positions/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      const data =
        await response.json();

successAlert(
  "Success",
  data.message
);
      loadPositions();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 p-6 text-white">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-8 text-4xl font-bold">
          Positions Management
        </h1>

        {/* Add Position Form */}
        <div className="mb-10 rounded-2xl bg-slate-800 p-6 shadow-xl">
          <h2 className="mb-6 text-2xl font-bold">
            Add Position
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block">
                Position Title
              </label>

              <input
                type="text"
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
                placeholder="President"
                className="w-full rounded-lg border border-slate-600 bg-slate-700 p-3 text-white"
              />
            </div>

            <div>
              <label className="mb-2 block">
                Maximum Selections
              </label>

              <input
                type="number"
                min="1"
                value={maxVotes}
                onChange={(e) =>
                  setMaxVotes(
                    Number(e.target.value)
                  )
                }
                className="w-full rounded-lg border border-slate-600 bg-slate-700 p-3 text-white"
              />
            </div>
          </div>

          <button
            onClick={addPosition}
            className="mt-6 rounded-lg bg-cyan-600 px-6 py-3 font-semibold text-white hover:bg-cyan-700"
          >
            Add Position
          </button>
        </div>

        {/* Position List */}
        <div className="grid gap-6 md:grid-cols-2">
          {positions.map((position) => (
            <div
              key={position.id}
              className="rounded-2xl bg-slate-800 p-6 shadow-xl"
            >
              <h2 className="text-2xl font-bold text-cyan-400">
                {position.title}
              </h2>

              <p className="mt-3 text-slate-300">
                Select up to{" "}
                <span className="font-bold text-white">
                  {position.max_votes}
                </span>{" "}
                candidate
                {position.max_votes > 1
                  ? "s"
                  : ""}
              </p>

              <button
                onClick={() =>
                  deletePosition(position.id)
                }
                className="mt-4 rounded-lg bg-red-600 px-4 py-2 font-semibold hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
