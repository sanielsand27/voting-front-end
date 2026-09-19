import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {API_URL, SERVER_URL} from "../config/api";


import {
  successAlert,
  errorAlert,
  warningAlert
} from "../utils/alerts";






type Candidate = {
  id: number;
  fullname: string;
  bio?: string;
  photo?: string;
  title?: string;
  position_id: number;
  max_votes: number;
};


export default function Candidates() {

const navigate = useNavigate();

  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);


const [selectedVotes, setSelectedVotes] =
  useState<Record<number, number[]>>({});


useEffect(() => {
  const loadData = async () => {
    try {
      const token = localStorage.getItem("token");

    const statusResponse = await fetch(
      `${API_URL}/settings/election-status`
    );

    const statusData =
      await statusResponse.json();

    if (!statusData.election_open) {
      await warningAlert(
        "Election Closed",
        "Voting is currently closed."
      );

      navigate("/results");
      return;
    }


      // Check if user already voted
      const summaryResponse = await fetch(
        `${API_URL}/votes/summary`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const summaryData =
        await summaryResponse.json();

      if (
        Array.isArray(summaryData) &&
        summaryData.length > 0
      ) {
        navigate("/vote-summary");
        return;
      }

      // Load candidates
      const candidatesResponse = await fetch(
        `${API_URL}/candidates`
      );

      const candidatesData =
        await candidatesResponse.json();

      setCandidates(candidatesData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  loadData();
}, [navigate]);




 const positions = [
    ...new Set(
      candidates
        .map((candidate) => candidate.title)
        .filter(Boolean)
    ),
  ];

  const currentPosition = positions[currentStep];

  const currentCandidates = candidates.filter(
    (candidate) => candidate.title === currentPosition
  );



useEffect(() => {
  if (
    positions.length > 0 &&
    currentStep > positions.length
  ) {
    const timer = setTimeout(() => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      navigate("/login");
    }, 5000);

    return () => clearTimeout(timer);
  }
}, [currentStep, positions.length, navigate]);


const toggleCandidate = (
  candidate: Candidate
) => {
  setSelectedVotes((prev) => {
    const current = Array.isArray(
      prev[candidate.position_id]
    )
      ? prev[candidate.position_id]
      : [];

    const alreadySelected =
      current.includes(candidate.id);

    if (alreadySelected) {
      return {
        ...prev,
        [candidate.position_id]:
          current.filter(
            (id) => id !== candidate.id
          ),
      };
    }

    if (
      current.length >=
      candidate.max_votes
    ) {
warningAlert(
  "Selection Limit Reached",
  `You can only select ${candidate.max_votes} candidate(s) for this position`
);
      return prev;
    }

    return {
      ...prev,
      [candidate.position_id]: [
        ...current,
        candidate.id,
      ],
    };
  });
};

const submitVotes = async () => {
  try {
    const token = localStorage.getItem("token");

    const votes: {
      position_id: number;
      candidate_id: number;
    }[] = [];

    Object.entries(selectedVotes).forEach(
      ([position_id, candidateIds]) => {
        candidateIds.forEach((candidate_id) => {
          votes.push({
            position_id: Number(position_id),
            candidate_id,
          });
        });
      }
    );

    // ADD THESE HERE
    console.log("selectedVotes", selectedVotes);
    console.log("votes payload", votes);

    const response = await fetch(
      `${API_URL}/votes/submit`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          votes,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.log("Server Error:", data);
errorAlert(
  "Ballot Submission Failed",
  data.message
);

      return;
    }

await successAlert(
  "Ballot Submitted",
  "Your votes have been recorded successfully."
);

setCurrentStep(
  positions.length + 1
);

    } catch (error) {
      console.error(error);
      alert("Failed to submit ballot");
    }
  };















  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900">
        <h2 className="text-2xl font-bold text-white">
          Loading...
        </h2>
      </div>
    );
  }

  if (
    positions.length > 0 &&
    currentStep === positions.length
  ) {
    return (
      <div className="min-h-screen bg-slate-900 p-6 text-white">
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-8 text-center text-4xl font-bold">
            Review Ballot
          </h1>

          {positions.map((position) => {
            const positionCandidates =
              candidates.filter(
                (c) => c.title === position
              );

const selectedCandidates =
  positionCandidates.filter(
    (candidate) =>
      (
        selectedVotes[
          candidate.position_id
        ] || []
      ).includes(candidate.id)
  );

            return (
              <div
                key={position}
                className="mb-4 rounded-xl bg-slate-800 p-4"
              >
                <h2 className="font-bold text-cyan-400">
                  {position}
                </h2>

<div className="mt-2">
  {selectedCandidates.length > 0 ? (
    selectedCandidates.map((candidate) => (
      <p key={candidate.id}>
        • {candidate.fullname}
      </p>
    ))
  ) : (
    <p>No Selection</p>
  )}
</div>


              </div>
            );
          })}

          <div className="mt-8 flex justify-between">
            <button
              onClick={() =>
                setCurrentStep(
                  positions.length - 1
                )
              }
              className="rounded-lg bg-yellow-600 px-6 py-3 font-semibold text-white"
            >
              Back
            </button>

            <button
              onClick={submitVotes}
              className="rounded-lg bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700"
            >
              Submit Ballot
            </button>
          </div>
        </div>
      </div>
    );
  }

if (
  positions.length > 0 &&
  currentStep > positions.length
) {

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-green-500">
          ✅ Thank You For Voting
        </h1>

        <p className="mt-4 text-slate-300">
          Your ballot has been submitted successfully.
        </p>

        <p className="mt-2 text-slate-400">
          Logging out automatically in 5 seconds...
        </p>
      </div>
    </div>
  );
}


  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 p-6">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-4 text-center text-4xl font-bold text-white">
          Election Wizard
        </h1>

        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-cyan-400">
            {currentPosition}
          </h2>

          <p className="mt-2 text-slate-400">
            Step {currentStep + 1} of{" "}
            {positions.length}
          </p>

<p className="mt-2 text-slate-400">
  Select up to{" "}
  {currentCandidates[0]?.max_votes || 1}
  {" "}candidate(s)
</p>

<p className="text-cyan-400">
  Selected:
  {" "}
  {
    (
      selectedVotes[
        currentCandidates[0]
          ?.position_id
      ] || []
    ).length
  }
  /
  {currentCandidates[0]?.max_votes || 1}
</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {currentCandidates.map((candidate) => {
            const imageUrl =
              `${SERVER_URL}${candidate.photo}`;


const selected =
  selectedVotes[candidate.position_id];

const isSelected =
  Array.isArray(selected)
    ? selected.includes(candidate.id)
    : false;









            return (
              <div
                key={candidate.id}
                className={`overflow-hidden rounded-2xl border shadow-xl transition-all duration-300 hover:-translate-y-1 ${
                  isSelected
                    ? "border-green-500 bg-slate-700"
                    : "border-slate-700 bg-slate-800"
                }`}
              >

<div className="p-4">
{candidate.photo && (

 <img
    src={imageUrl}
    alt={candidate.fullname}
    className="hy-center rounded-lg bg-slate-700 text-4xl font-bold text-white"
  />
)}
</div>




                <div className="p-5">
                  <h2 className="mb-2 text-2xl font-bold text-white">
                    {candidate.fullname}
                  </h2>

                  {candidate.title && (
                    <p className="mb-2 font-medium text-cyan-400">
                      {candidate.title}
                    </p>
                  )}

                  {candidate.bio && (
                    <p className="mb-4 text-slate-300">
                      {candidate.bio}
                    </p>
                  )}

                  <button
                    onClick={() =>
                      toggleCandidate(candidate)
                    }
                    className={`w-full rounded-xl py-3 font-semibold text-white transition ${
                      isSelected
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    {isSelected
                      ? "Selected"
                      : "Select"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex justify-between">
          <button
            disabled={currentStep === 0}
            onClick={() =>
              setCurrentStep(
                (prev) => prev - 1
              )
            }
            className="rounded-lg bg-slate-700 px-6 py-3 font-semibold text-white disabled:opacity-50"
          >
            Previous
          </button>

          <button

disabled={
  (
    selectedVotes[
      currentCandidates[0]
        ?.position_id
    ] || []
  ).length === 0
}

            onClick={() =>
              setCurrentStep(
                (prev) => prev + 1
              )
            }
            className="rounded-lg bg-cyan-600 px-6 py-3 font-semibold text-white hover:bg-cyan-700 disabled:bg-slate-600"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
