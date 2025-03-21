import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react"
import { useAuth0 } from "@auth0/auth0-react"
import { api } from "../api"

interface User {
  _id: string
  username: string
  firstName: string
  lastName: string
  role: string
}

interface UserContextType {
  user: User | null
  error: string | null
  loading: boolean
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const { user: auth0User } = useAuth0() // Get user from Auth0
  const [user, setUser] = useState<User | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")

    if (storedUser) {
      setUser(JSON.parse(storedUser)) // ✅ Restore user from storage
      setLoading(false)
      return
    }

    const fetchUser = async () => {
      if (!auth0User?.sub || user) return // ✅ Skip if user already exists

      try {
        // Fetch the user based on `user_id` instead of `_id`
        const response = await api.get(
          `/api/user/by-auth0-id/${encodeURIComponent(auth0User.sub)}`
        )

        console.log("Fetched user data:", response.data)

        if (response.data && response.data._id) {
          setUser(response.data)
          localStorage.setItem("user", JSON.stringify(response.data)) // ✅ Store user persistently
        } else {
          setError("User not found")
        }
      } catch (err) {
        console.error("Error fetching user:", err)
        setError("Failed to fetch user information")
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [auth0User?.sub])

  return (
    <UserContext.Provider value={{ user, error, loading }}>
      {children}
    </UserContext.Provider>
  )
}

// Hook to use the UserContext
export const useUser = () => {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
