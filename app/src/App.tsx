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
import ProtectedRoute from "./components/ProtectedRoute";
import { useCurrentUser } from "./hooks/useCurrentUser";
function App(): ReactElement {
  const { isAuthenticated, user: Auth0User } = useAuth0();
  const { user } = useCurrentUser(Auth0User?.email || "");

  const userRole = user?.role;

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
            {/* <Route path="/" element={<Home />} /> */}
            {/* <Route path="/home" element={<Home />} /> */}

            <Route
              path="/mentor"
              element={
                <ProtectedRoute
                  element={<MentorDashboard />}
                  allowedRoles={["mentor", "admin"]}
                />
              }
            />

            {userRole === "mentee" ? (
              <Route
                path="/home"
                element={
                  <ProtectedRoute
                    element={<MenteeDashboard />}
                    allowedRoles={["mentee"]}
                  />
                }
              />
            ) : (
              <Route
                path="/home"
                element={
                  <ProtectedRoute
                    element={<MentorDashboard />}
                    allowedRoles={["mentor", "admin"]}
                  />
                }
              />
            )}

            <Route
              path="/mentee"
              element={
                <ProtectedRoute
                  element={<MenteeDashboard />}
                  allowedRoles={["mentee", "admin"]}
                />
              }
            />
            <Route path="/confirmLogout" element={<ConfirmLogout />} />
            <Route
              path="/create-workshop"
              element={
                <ProtectedRoute
                  element={<CreateWorkshop />}
                  allowedRoles={["mentor", "admin"]}
                />
              }
            />
            <Route
              path="/create-meeting"
              element={
                <ProtectedRoute
                  element={<CreateMeeting />}
                  allowedRoles={["mentor", "admin"]}
                />
              }
            />
            <Route path="/profile" element={<Profile />} />
            <Route
              path="/mentor/mentee-information"
              element={
                <ProtectedRoute
                  element={<MenteeInformation />}
                  allowedRoles={["mentor", "admin"]}
                />
              }
            />
            <Route
              path="/mentor/workshop-information"
              element={
                <ProtectedRoute
                  element={<WorkshopInformation />}
                  allowedRoles={["mentor", "admin"]}
                />
              }
            />
          </>
        )}
      </Routes>
    </div>
  );
}
export default App;
