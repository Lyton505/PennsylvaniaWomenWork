import React, { type ReactElement } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useAuth0 } from "@auth0/auth0-react"

const Navbar = (): ReactElement => {
  const navigate = useNavigate()
  const location = useLocation() // Get current route
  const { isAuthenticated, logout } = useAuth0()

  return (
    <div className="Navbar">
      <div className="Navbar-body">
        <div
          className="Navbar-body-logo"
          onClick={() => navigate("/home")}
        ></div>

        <div className="Navbar-left">
          {[
            { path: "/mentor", label: "Mentor" },
            { path: "/mentee", label: "Mentee" },
            { path: "/create-workshop", label: "Create Workshop" },
            { path: "/create-meeting", label: "Create Meeting" },
            { path: "/profile", label: "Profile" },
          ].map((tab) => (
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
                onClick={() => navigate("/login")}
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
                logout()
                navigate("/logout")
              }}
            >
              Log Out
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Navbar
