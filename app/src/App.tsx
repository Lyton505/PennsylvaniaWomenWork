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
import Logout from "./pages/Logout";
import Profile from "./pages/Profile";
import { useAuth0 } from "@auth0/auth0-react";

function App(): ReactElement {
  const { isAuthenticated } = useAuth0();

  return (
    <div className="App">
      <Routes>
        <Route path="/callback" element={<AuthCallback />} />
        {!isAuthenticated ? (
          <>
            <Route path="/logout" element={<Logout />} />
            <Route path="*" element={<LoginRedirect />} />
          </>
        ) : (
          <>
            <Route path="/login" element={<LoginRedirect />} />
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/mentor" element={<MentorDashboard />} />
            <Route path="/mentee" element={<MenteeDashboard />} />
            <Route path="/confirmLogout" element={<ConfirmLogout />} />
            <Route path="/create-workshop" element={<CreateWorkshop />} />
            <Route path="/create-meeting" element={<CreateMeeting />} />
            <Route path="/profile" element={<Profile />} />
            <Route
              path="/mentor/mentee-information"
              element={<MenteeInformation />}
            />
            <Route
              path="/mentor/workshop-information"
              element={<WorkshopInformation />}
            />
          </>
        )}
      </Routes>
    </div>
  );
}

export default App;
