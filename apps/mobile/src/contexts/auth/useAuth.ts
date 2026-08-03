import { useContext } from "react";

import { AuthContext, AuthContextType } from "./auth.context";

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error(
      'useAuthContext deve ser utilizado dentro de AuthProvider',
    );
  }
  return context as AuthContextType;
};