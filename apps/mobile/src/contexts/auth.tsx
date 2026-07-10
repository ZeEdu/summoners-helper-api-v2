import React, { createContext, ReactNode, useContext, useMemo, useState } from "react"

import { ICreateUserDto } from "@summoners-helper/shared-types"
import { useFetch } from "../hooks/useFetch"

export type User = {
  email: string
}
type Login = (user: User) => void
type Logout = () => void
type AuthContextType = { user: User | undefined, login: Login, logout: Logout }

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const ENDPOINT = ''
const AUTH_URL = ''
const USERS_URL = ''

export function AuthProvider() {
  const [user, setUser] = useState<User | undefined>(undefined)

  const login = (user: User) => {
    // Buscar na API
    setUser(user)
  }

  const logout = () => {
    // Buscar na API
    setUser(undefined)
  }

  const register = (createUserDto: ICreateUserDto) => {
    const url = `localhost:`

  }

  const refresh = () => {
    // Faz o refreshToken user atual
    // Puxando os dados mais recentes
    // Atualiza o tokenRefresh do mesmo
  }

  const me = () => {

  }

  const value: AuthContextType = useMemo(() => ({ user, login, logout }), [user, login, logout])

  const Provider = ({ children }: { children: ReactNode }) => {
    return <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  }

  const useAuthContext = (): AuthContextType => {
    const context = useContext(AuthContext)
    if (context === undefined) {
      throw new Error('useAuthContext deve ser utilizado dentro de AuthProvider')
    }
    return context
  }


  return [Provider, useAuthContext] as const
}