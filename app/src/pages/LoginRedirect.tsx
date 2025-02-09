import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const LoginRedirect = () => {
  const { loginWithRedirect } = useAuth0();

  console.log("window.location.pathname", window.location.pathname);

  useEffect(() => {
    loginWithRedirect({
      appState: {
        // returnTo: "/home",
        returnTo: window.location.pathname || "/home",
      },
    });
  }, [loginWithRedirect]);

  return null;
};

export default LoginRedirect;
