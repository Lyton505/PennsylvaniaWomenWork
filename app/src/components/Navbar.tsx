import React, { type ReactElement } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useCurrentUser } from "../hooks/useCurrentUser";

const Navbar = (): ReactElement => {
  const navigate = useNavigate();
  const location = useLocation(); // Get current route
  const { isAuthenticated, logout, user: auth0User } = useAuth0();
  const { user, loading } = useCurrentUser(auth0User?.email || "");

  const navItems = [
    { path: "/mentor", label: "Mentor", roles: ["mentor", "admin"] },
    { path: "/mentee", label: "Mentee", roles: ["mentee", "admin"] },
    {
      path: "/create-workshop",
      label: "Create Workshop",
      roles: ["mentor", "admin"],
    },
    {
      path: "/create-meeting",
      label: "Create Meeting",
      roles: ["mentor", "admin"],
    },
    {
      path: "/profile",
      label: "Profile",
      roles: ["mentor", "mentee", "admin"],
    },
  ];

  return (
    <div className="Navbar">
      <div className="Navbar-body">
        <div
          className="Navbar-body-logo"
          onClick={() => navigate("/home")}
        ></div>

        <div className="Navbar-left">
          {navItems
            .filter((item) => user && item.roles.includes(user.role))
            .map((tab) => (
              <div
                key={tab.path}
                className={`Navbar-body-link ${location.pathname === tab.path ? "Navbar-active" : ""}`}
                onClick={() => navigate(tab.path)}
              >
                {tab.label}
              </div>
            ))}

          {!isAuthenticated ? (
            <div className="Flex-row">
              <div
                className="Button Button-color--teal-1000 Margin-right--20"
                onClick={() => navigate("/")}
              >
                Log In
              </div>

              <div
                className="Button Button-color--teal-1000"
                onClick={() => navigate("/signup")}
              >
                Sign Up
              </div>
            </div>
          ) : (
            <div
              className="Button Button-color--teal-1000"
              onClick={() => {
                logout();
              }}
            >
              Log Out
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
