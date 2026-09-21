import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { errorAlert } from "../utils/alerts";
import { API_URL } from "../config/api";


export default function Login() {
  const navigate = useNavigate();


const [username, setUsername] = useState("");
const [password, setPassword] = useState("");


  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${ API_URL }/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
body: JSON.stringify({
  username,
  password,
}),

        }
      );

      const data = await response.json();

      if (!response.ok) {
	errorAlert("Login Failed", data.message);
        return;
      }

      localStorage.setItem(
        "token",
        data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      if (data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/candidates");
      }
    } catch (error) {
      console.error(error);
      alert("Login failed");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl bg-slate-800 p-6 shadow-xl"
      >
        <h1 className="mb-6 text-center text-3xl font-bold text-white">
          Login
        </h1>

        <input
          type="text"
          placeholder="ID or Email"
          value={username}
          onChange={(e) =>
            setUsername(e.target.value)
          }
          className="mb-4 w-full rounded-lg border border-slate-600 bg-slate-700 p-3 text-white"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          className="mb-4 w-full rounded-lg border border-slate-600 bg-slate-700 p-3 text-white"
        />

        <button
          type="submit"
          className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700"
        >
          Login
        </button>
      </form>
    </div>
  );
}
