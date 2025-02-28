import React from "react";
import Navbar from "../components/Navbar";
import { useUser } from "../contexts/UserContext";
import { useAuth0 } from "@auth0/auth0-react";
import Icon from "../components/Icon";
import '../styles/_profile.scss';


const Profile = () => {
  const { user: auth0User } = useAuth0();
  const { user, error, loading } = useUser();


  return (
    <>
      <Navbar />

      <div className="Profile">
        {loading ? (
          <p>Loading user info...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : auth0User && user ? (
          <div className="Profile-Block">
            <div className="Profile-header">Profile Information</div>
            <div className="Profile-subheader">User Details and Settings</div>
            <div className="Profile-content">
              <div className="Profile-avatar">
                <img 
                  src={auth0User.picture} 
                  alt={`${auth0User.name}'s profile`}
                  className="Profile-avatar-image"
                />
              </div>
              <div className="Profile-field">
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong>Username:</strong>
                  <span>{user.username}</span>
                </div>
              </div>
              <div className="Profile-field">
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong>Name:</strong>
                  <span>{auth0User.name}</span>
                </div>
              </div>
              <div className="Profile-field">
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong>Nickname:</strong>
                  <span>{auth0User.nickname}</span>
                </div>
              </div>
              <div className="Profile-field">
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong>Role:</strong>
                  <span>{user.role}</span>
                </div>
              </div>
              <div className="Profile-field">
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong>Email:</strong>
                  <span>{auth0User.email}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p>No user info available</p>
        )}
      </div>
    </>
  );
};

export default Profile;
