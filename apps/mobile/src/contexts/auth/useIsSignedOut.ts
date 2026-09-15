import { useAuthContext } from "./useAuth";

export default function useIsNotAuthenticated() {
  const { user } = useAuthContext()
  return user === undefined
}