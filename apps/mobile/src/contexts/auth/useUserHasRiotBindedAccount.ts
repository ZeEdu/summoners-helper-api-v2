import { useAuthContext } from "./useAuth"

export default function useUserHasRiotBindedAccount() {
  const { user } = useAuthContext()
  if (user) {
    return !!user.puuid
  }
  return false
}