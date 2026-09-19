import { useEffect, useState } from "react";
import {API_URL, SERVER_URL} from "../config/api";

import {
  successAlert
} from "../utils/alerts";


type Voter = {
  id: number;
  student_id: string;
  fullname: string;
  email: string;
};


export default function Voters() {
  const [voters, setVoters] = useState<Voter[]>([]);

const [studentId, setStudentId] = useState("");
const [fullname, setFullname] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");

  const [file, setFile] = useState<File | null>(null);




  const loadVoters = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/admin/voters`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      setVoters(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadVoters();
  }, []);

  const createVoter = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/admin/voters`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
	student_id: studentId,
            fullname,
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
successAlert(
  "Success",
  data.message
);


        return;
      }
      setStudentId("");
      setFullname("");
      setEmail("");
      setPassword("");

      loadVoters();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteVoter = async (id: number) => {
    if (!window.confirm("Delete this voter?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await fetch(
        `${API_URL}/admin/voters/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      loadVoters();
    } catch (error) {
      console.error(error);
    }
  };

  const resetPassword = async (id: number) => {
    const newPassword = prompt(
      "Enter new password"
    );

    if (!newPassword) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/admin/voters/${id}/password`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            password: newPassword,
          }),
        }
      );

      const data = await response.json();

successAlert(
  "Success",
  data.message
);


    } catch (error) {
      console.error(error);
    }
  };

 
const importExcel = async () => {
  if (!file) {
    alert("Select a file");
    return;
  }

  const token =
    localStorage.getItem("token");

  const formData =
    new FormData();

  formData.append(
    "file",
    file
  );

  const response = await fetch(
    `{API_URL}/admin/voters/import`,
    {
      method: "POST",
      headers: {
        Authorization:
          `Bearer ${token}`,
      },
      body: formData,
    }
  );

  const data =
    await response.json();

successAlert(
  "Import Completed",
  `Imported: ${data.imported}
   Skipped: ${data.skipped}`
);



  loadVoters();
};



 return (
    <div className="min-h-screen bg-slate-900 p-6 text-white">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-8 text-4xl font-bold">
          Voter Management
        </h1>


<div className="mb-6 rounded-xl bg-slate-800 p-4">
  <h2 className="mb-4 text-xl font-bold">
    Import Voters
  </h2>

  <input
    type="file"
    accept=".xlsx,.xls"
    onChange={(e) =>
      setFile(
        e.target.files?.[0] || null
      )
    }
    className="mb-4 block"
  />

  <button
    onClick={importExcel}
    className="rounded-lg bg-green-600 px-4 py-2 font-semibold text-white hover:bg-green-700"
  >
    Upload Excel
  </button>
</div>
        <div className="mb-8 rounded-2xl bg-slate-800 p-6 shadow-xl">
          <h2 className="mb-4 text-2xl font-bold">
            Add Voter
          </h2>

          <form
            onSubmit={createVoter}
            className="space-y-4"
          >
<input
  type="text"
  placeholder="Student ID"
  value={studentId}
  onChange={(e) =>
    setStudentId(e.target.value)
  }
  className="w-full rounded-lg border border-slate-600 bg-slate-700 p-3 text-white"
/>




            <input
              type="text"
              placeholder="Full Name"
              value={fullname}
              onChange={(e) =>
                setFullname(e.target.value)
              }
              className="w-full rounded-lg border border-slate-600 bg-slate-700 p-3 text-white"
              required
            />

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className="w-full rounded-lg border border-slate-600 bg-slate-700 p-3 text-white"
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              className="w-full rounded-lg border border-slate-600 bg-slate-700 p-3 text-white"
              required
            />

            <button
              type="submit"
              className="rounded-lg bg-green-600 px-6 py-3 font-semibold hover:bg-green-700"
            >
              Add Voter
            </button>
          </form>
        </div>

        <div className="rounded-2xl bg-slate-800 p-6 shadow-xl">
          <h2 className="mb-6 text-2xl font-bold">
            Registered Voters
          </h2>

          <div className="space-y-4">
            {voters.map((voter) => (
              <div
                key={voter.id}
                className="flex flex-col gap-4 rounded-xl bg-slate-700 p-4 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <h3 className="text-lg font-bold">
                    {voter.fullname}
                  </h3>
		<p className="text-cyan-400">
                  ID: {voter.student_id}
                </p>

                  <p className="text-slate-300">
                    {voter.email}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      resetPassword(voter.id)
                    }
                    className="rounded-lg bg-yellow-600 px-4 py-2 font-semibold hover:bg-yellow-700"
                  >
                    Reset Password
                  </button>

                  <button
                    onClick={() =>
                      deleteVoter(voter.id)
                    }
                    className="rounded-lg bg-red-600 px-4 py-2 font-semibold hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}

            {voters.length === 0 && (
              <p className="text-slate-400">
                No voters found.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
