import { useAuthContext } from "./useAuth"

export default function useIsAuthenticated() {
  const { user } = useAuthContext()
  return !!user
}