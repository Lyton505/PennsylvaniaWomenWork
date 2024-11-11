import { useAuth0 } from "@auth0/auth0-react";
import React from "react";

export const SignupButton = () => {
  const { loginWithRedirect } = useAuth0();

  const handleSignUp = async () => {
    await loginWithRedirect({
      appState: {
        returnTo: "/home",
      },
      authorizationParams: {
        screen_hint: "signup",
      },
    });
  };

  return (
    <button
      style={{
        margin: "0 12px",
        padding: "8px 16px",
        backgroundColor: "#4285f4",
        color: "white",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: 500,
        transition: "background-color 0.2s ease",
      }}
      onClick={handleSignUp}
    >
      Sign Up
    </button>
  );
};
