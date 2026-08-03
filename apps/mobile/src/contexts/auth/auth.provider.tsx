import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";

import { ICreateUserDto, ILoginUserDto, IUser } from "@org/contracts";

import { AuthEvents } from "../../auth-events";
import { useThemeContext } from "../../providers/theme.provider";
import { ApiService } from "../../services/api/api.service";
import { AuthTokenStorageService } from "../../services/auth-token-storage.service";
import { ThemeStorageService } from "../../services/theme-storage.service";
import { AuthContext, AuthContextType } from "./auth.context";

type AuthProviderProps = {
  children: ReactNode
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const themeContext = useThemeContext()
  const [user, setUser] = useState<IUser | undefined>(undefined);

  const login = async (loginUserDto: ILoginUserDto) => {
    try {
      await AuthTokenStorageService.delete()

      const response = await ApiService.Auth.login(loginUserDto)
      const {
        accessToken,
        refreshToken,
      }: { accessToken: string; refreshToken: string } = response;

      await AuthTokenStorageService.set(accessToken, refreshToken)
      await me()
      return { success: true }
    } catch (error) {
      return { success: false, errors: {} };
    }
  };

  const logout = async () => {
    await ApiService.Auth.logout()
    await AuthTokenStorageService.delete()
    setUser(undefined);
  };

  const register = useCallback(async (createUserDto: ICreateUserDto) => {
    let accessToken: string
    let refreshToken: string

    try {
      const response = await ApiService.Auth.register(createUserDto);
      const tokens: { accessToken: string; refreshToken: string } = response;
      accessToken = tokens.accessToken
      refreshToken = tokens.refreshToken

      await AuthTokenStorageService.set(accessToken, refreshToken);
    } catch (error: any) {
      if (error?.body['username'] || error?.body['email'] || error?.body['password']) {
        return { success: false, errors: error.body };
      }

      return { success: false, errors: 'Não foi possível registrar o usuário' };
    }

    try {
      await me()
      return { success: true };
    } catch (error) {
      return { success: false, errors: 'Não foi possivel recuperar os dados do usuário' };
    }
  }, []);

  const me = useCallback(async () => {
    try {
      const response = await ApiService.Users.me();

      const userFromRequest = response as IUser;
      setUser(userFromRequest)
      return userFromRequest
    } catch (error) {
      return undefined
    }
  }, []);


  useEffect(() => {
    async function checkStoredTokens() {
      const tokens = await AuthTokenStorageService.get()
      if (tokens.accessToken && !user) {
        await me()
      }
    }
    checkStoredTokens()
  }, [])

  useEffect(() => {
    return AuthEvents.onSessionExpired(() => {
      logout()
    })
  }, [])

  useEffect(() => {
    async function checkThemePreference() {
      if (user) {
        const isDarkTheme = await ThemeStorageService.isDarkTheme()
        if (!themeContext.isThemeDark && isDarkTheme) {
          themeContext.toggleTheme()
        }
      }
    }

    checkThemePreference()
  }, [user])

  const value: AuthContextType = useMemo(
    () => ({ user, login, logout, register, me }),
    [user, login, logout, register, me],
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  )
}