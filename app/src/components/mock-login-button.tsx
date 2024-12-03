import { useAuth0 } from "@auth0/auth0-react";
import React from "react";

export const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  const handleLogin = async () => {
    await loginWithRedirect({
      appState: {
        returnTo: "/home",
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
      onClick={handleLogin}
    >
      Log In
    </button>
  );
};
