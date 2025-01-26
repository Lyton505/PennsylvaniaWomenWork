import React, { type ReactElement } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import MentorDashboard from "./pages/MentorDashboard";
import MenteeDashboard from "./pages/MenteeDashboard";
import ConfirmLogout from "./pages/ConfirmLogout";
import CreateWorkshop from "./pages/CreateWorkshop";
import CreateMeeting from "./pages/CreateMeeting";
import MenteeInformation from "./pages/MenteeInformation";
import WorkshopInformation from "./pages/WorkshopInformation";
import AuthCallback from "./pages/auth-callback";
import LoginRedirect from "./pages/LoginRedirect";
import { useCurrentUser } from "./hooks/useCurrentUser";
import { useAuth0 } from "@auth0/auth0-react";

function App(): ReactElement {
  const {
    user: auth0User,
    isLoading: authLoading,
    error: authError,
  } = useAuth0();
  const username = auth0User?.nickname || "";
  const { user, error, loading } = useCurrentUser(username); // Fetch user details from backend
  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<LoginRedirect />} />
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/mentor" element={<MentorDashboard />} />
        <Route path="/mentee" element={<MenteeDashboard />} />
        <Route path="/confirmLogout" element={<ConfirmLogout />} />
        <Route path="/create-workshop" element={<CreateWorkshop />} />
        <Route path="/create-meeting" element={<CreateMeeting />} />
        <Route
          path="/mentor/mentee-information"
          element={<MenteeInformation />}
        />
        <Route
          path="/mentor/workshop-information"
          element={<WorkshopInformation />}
        />
        <Route path="/callback" element={<AuthCallback />} />
      </Routes>
      <div
        style={{
          position: "fixed",
          bottom: "10px",
          right: "10px",
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          color: "white",
          padding: "10px",
          borderRadius: "5px",
        }}
      >
        {/* Display Auth0 or Backend loading/errors */}
        {authLoading || loading ? (
          <p>Loading user info...</p>
        ) : authError || error ? (
          <p>Error: {authError?.message || error}</p>
        ) : auth0User && user ? (
          <div>
            <p>Username: {user.username}</p>
            <p>Role: {user.role}</p>
            <p>Email: {auth0User.email}</p>
          </div>
        ) : (
          <p>No user info available</p>
        )}
      </div>
    </div>
  );
}

export default App;
