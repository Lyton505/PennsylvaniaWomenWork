import { useNavigate } from "react-router-dom"
import { useAuth0 } from "@auth0/auth0-react"
import { useEffect } from "react"
import Navbar from "../components/Navbar"

const AuthCallback = () => {
  const { isLoading, error, handleRedirectCallback } = useAuth0();

  const navigate = useNavigate();

  useEffect(() => {
    const handleCallbackFunc = async () => {
      try {
        const result = await handleRedirectCallback();
        const targetUrl = result?.appState?.returnTo || "/home";
        navigate(targetUrl);
      } catch (err) {
        console.error("Error handling redirect:", err);
        navigate("/");
      }
    };

    if (!isLoading) {
      handleCallbackFunc();
    }
  }, [isLoading, handleRedirectCallback, navigate]);

  if (error) {
    console.error("Google auth login error", error);
  }

  return <Navbar />
}

export default AuthCallback
