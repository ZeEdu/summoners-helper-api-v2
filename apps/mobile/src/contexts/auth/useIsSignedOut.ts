import { useAuthContext } from "./useAuth";

export default function useIsNotAuthenticated() {
  const { user } = useAuthContext()
  console.log({ user });
  return user === undefined
}