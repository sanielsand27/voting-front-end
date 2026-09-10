import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Candidates from "./pages/Candidates";
import Results from "./pages/Results";
import AdminDashboard from "./pages/AdminDashboard";
import Voters from "./pages/Voters";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import CandidateManagement from "./pages/CandidateManagement";
import VoteSummary from "./pages/VoteSummary";
import Positions from "./pages/Positions";


function App() {
  return (
    <Routes>
      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/candidates"
        element={
          <ProtectedRoute>
            <Candidates />
          </ProtectedRoute>
        }
      />

      <Route
        path="/results"
        element={
          <ProtectedRoute>
            <Results />
          </ProtectedRoute>
        }
      />


<Route
  path="/candidates-manage"
  element={
    <AdminRoute>
      <CandidateManagement />
    </AdminRoute>
  }
/>

<Route
  path="/vote-summary"
  element={<VoteSummary />}
/>




<Route
  path="/voters"
  element={
    <AdminRoute>
      <Voters />
    </AdminRoute>
  }
/>


<Route
  path="/positions"
  element={<Positions />}
/>




      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />
    </Routes>
  );
}

export default App;
