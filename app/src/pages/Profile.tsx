import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useUser, User } from "../contexts/UserContext";
import { useAuth0 } from "@auth0/auth0-react";
import { api } from "../api";
import { toast } from "react-hot-toast";
import { set } from "react-hook-form";


const Profile = () => {
  const { user: auth0User, logout } = useAuth0();
  const { user, error, loading, setUser } = useUser();
  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const res = await api.get(
          `/api/resource/getURL/${user?.profile_picture_id}`
        );
        console.log("Response from getURL:", res.data);
        if (res.data && res.data.signedUrl) {
          setProfileImage(res.data.signedUrl);
          console.log("Profile image URL:", res.data.signedUrl);
        }
      } catch (error) {
        console.error("Failed to fetch profile image:", error);
        setProfileImage(null);
      }
    };

    if (user?.profile_picture_id) {
      fetchProfileImage();
    }
  }, [user?.profile_picture_id]);

  // Function to compute initials from first and last name
  const getInitials = () => {
    if (!user) return "";
    const firstInitial = user.first_name
      ? user.first_name.charAt(0).toUpperCase()
      : "";
    const lastInitial = user.last_name
      ? user.last_name.charAt(0).toUpperCase()
      : "";
    return firstInitial + lastInitial;
  };

  const handleImageUpload = async (values: any) => {
    try {
      console.log("values", values);

      if (!values.imageUpload) {
        toast.error("Please select an image");
        return;
      }

      let profileImageS3id = null;

      if (values.imageUpload) {
        // Get presigned URL for the pfp
        const pfpImageResponse = await api.get(
          `/api/workshop/generate-presigned-url/${encodeURIComponent(values.imageUpload.name)}`
        );

        const { url: pfpImageUrl, objectKey: pfpImageObjectKey } =
          pfpImageResponse.data;

        // Upload the profile image to S3
        await fetch(pfpImageUrl, {
          method: "PUT",
          body: values.imageUpload,
          headers: { "Content-Type": values.imageUpload.type },
        });

        profileImageS3id = pfpImageObjectKey;
      }

      const payload = {
        profile_picture_id: profileImageS3id,
      };

      console.log("payload", payload);
      console.log("our user", user?.auth_id);

      const { status } = await api.put(
        `/api/user/${encodeURIComponent(user!.auth_id)}`,
        payload
      );

      if (status === 200) {
        toast.success("Profile picture updated successfully");
        setProfileImage(URL.createObjectURL(values.imageUpload));
        setUser({ ...user, profile_picture_id: profileImageS3id } as User);
      } else {
        toast.error("Failed to update profile picture. Please try again.");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Image upload failed. Please try again.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="Profile">
        {loading ? (
          <p>Loading user info...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : auth0User && user ? (
          <div className="Block Profile-Block">
            <div className="Block-header">Profile Information</div>
            <div className="Block-subtitle">User Details and Settings</div>
            <div className="Block-content">
              <div className="Profile-avatar">
                {profileImage ? (
                  <div
                    className="Profile-avatar-image"
                    style={{
                      backgroundImage: `url(${profileImage})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                ) : (
                  <div className="Profile-initials">{getInitials()}</div>
                )}
              </div>
              <div className="Profile-field">
                <div className="Profile-field-label">Name:</div>
                <div>
                  {user.first_name} {user.last_name}
                </div>
              </div>
              <div className="Profile-field">
                <div className="Profile-field-label">Role:</div>
                <div>{user.role}</div>
              </div>
              <div className="Profile-field">
                <div className="Profile-field-label">Email:</div>
                <div>{user.email}</div>
              </div>
              <div className="Profile-field">
                <div className="Profile-field-label">Add profile picture:</div>
                <input
                  type="file"
                  id="imageUpload"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) =>
                    handleImageUpload({ imageUpload: e.target.files?.[0] })
                  }
                />
                <div
                  className="Button Button-color--blue-1000"
                  onClick={() =>
                    document.getElementById("imageUpload")?.click()
                  }
                >
                  Add Image
                </div>
              </div>
              <div
                className="Button Button-color--blue-1000 Margin-top--20"
                onClick={() => {
                  logout();
                }}
              >
                Log Out
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
