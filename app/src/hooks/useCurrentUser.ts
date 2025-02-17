import { useState, useEffect } from "react";
import { api } from "../api";

export const useCurrentUser = (username: string) => {
  const [user, setUser] = useState<{ username: string; role: string } | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get(
          `/user/current-user?username=${encodeURIComponent(username)}`,
        );
        setUser(response.data);
      } catch (err) {
        console.error("Error fetching current user:", err);
        setError("Failed to fetch user information");
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchUser();
    }
  }, [username]);

  return { user, error, loading };
};
