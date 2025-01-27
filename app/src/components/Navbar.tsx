import react, { type ReactElement } from "react"
import { useNavigate } from "react-router-dom"
// import { LoginButton } from "./mock-login-button"
// import { SignupButton } from "./mock-sign-up"
// import { LogoutButton } from "./mock-logout-button"
import { useAuth0 } from "@auth0/auth0-react"

const Navbar = (): ReactElement => {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth0()
  const { logout } = useAuth0()

  return (
    <>
      <div className="Navbar">
        <div className="Navbar-body">
          <div
            className="Navbar-body-logo"
            onClick={() => {
              navigate("/home")
            }}
          ></div>
          <div className="Navbar-left">
            <div
              className="Navbar-body-link Margin-left--20"
              onClick={() => {
                navigate("/mentor")
              }}
            >
              Mentor
            </div>
            <div
              className="Navbar-body-link Margin-left--20"
              onClick={() => {
                navigate("/mentee")
              }}
            >
              Mentee
            </div>
            <div
              className="Navbar-body-link Margin-left--20"
              onClick={() => {
                navigate("/create-workshop")
              }}
            >
              Create Workshop
            </div>
            <div
              className="Navbar-body-link Margin-left--20"
              onClick={() => {
                navigate("/create-meeting")
              }}
            >
              Create Meeting
            </div>

            <div
              className="buttons Margin-left--20"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              {!isAuthenticated && (
                <div className="Flex-row">
                  {/* <LoginButton /> */}
                  <div
                    className="Button Button-color--teal-1000 Margin-right--20"
                    onClick={() => {
                      navigate("/login")
                    }}
                  >
                    Log In
                  </div>

                  <div
                    className="Button Button-color--teal-1000"
                    onClick={() => {
                      navigate("/signup")
                    }}
                  >
                    Sign Up
                  </div>
                  {/* <SignupButton /> */}
                </div>
              )}
              {isAuthenticated && (
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
      </div>
    </>
  )
}

export default Navbar
