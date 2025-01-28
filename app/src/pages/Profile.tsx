// make a dummy profile page
import React from "react"
import Navbar from "../components/Navbar"
import { useCurrentUser } from "../hooks/useCurrentUser"
import { useAuth0 } from "@auth0/auth0-react"

const Profile = () => {
  const {
    user: auth0User,
    isLoading: authLoading,
    error: authError,
  } = useAuth0()
  const username = auth0User?.email || ""
  const { user, error, loading } = useCurrentUser(username) // Fetch user details from backend

  return (
    <>
      <Navbar />
      <div className="Profile">
        <div className="Block">
          <div className="Block-header">Your Profile</div>
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
    </>
  )
}

export default Profile
