import { ReactNode, useCallback, useMemo, useState } from "react";
import { ICreateUserDto, ILoginUserDto, IUser } from "@org/shared-types";
import { ApiService } from "../../services/api/api.service";
import { AuthTokenStorageService } from "../../services/auth-token-storage.service";
import { AuthContext, AuthContextType } from "./auth.context";

type AuthProviderProps = {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<IUser | undefined>(undefined);

  const login = async (loginUserDto: ILoginUserDto) => {
    try {
      const response = await ApiService.Auth.login(loginUserDto)

      if (!response.ok) {
        console.log('login falhou');
        // TODO Tratar melhor esse erro
        // Aplicar um tratamento mais robusto no customFetch
        throw new Error('login falhou');
      }

      const {
        accessToken,
        refreshToken,
      }: { accessToken: string; refreshToken: string } = await response.json();

      console.log({
        accessToken,
        refreshToken,
      });

      await AuthTokenStorageService.set(accessToken, refreshToken)

      // Buscar na API
      return { success: true }
    } catch (error) {
      console.log({ error });
      return { success: false, errors: {} };
    }
  };

  const logout = async () => {
    // Buscar na API
    await AuthTokenStorageService.delete()
    setUser(undefined);
  };

  const register = useCallback(async (createUserDto: ICreateUserDto) => {
    try {
      const response = await ApiService.Auth.register(createUserDto);
      if (!response.ok) {
        throw new Error('Request Failed');
      }

      const {
        accessToken,
        refreshToken,
      }: { accessToken: string; refreshToken: string } = await response.json();

      await AuthTokenStorageService.set(accessToken, refreshToken);

      await me()

      return { success: true };
    } catch (error) {
      // TODO Tratar os erros e retornar um objeto legivel como resposta
      console.log({ error });
      return { success: false, errors: {} };
    }
  }, []);

  const refresh = () => {
    // Faz o refreshToken user atual
    // Puxando os dados mais recentes
    // Atualiza o tokenRefresh do mesmo
  };

  const me = useCallback(async () => {
    console.log('Entrou em me');

    try {
      const response = await ApiService.Users.me();

      if (!response.ok) {
        throw new Error('Request Failed');
      }

      const userFromRequest = (await response.json()) as IUser;
      console.log({ userFromRequest });
      setUser(userFromRequest)

      return user
    } catch (error) {
      return undefined
    }
  }, []);

  const value: AuthContextType = useMemo(
    () => ({ user, login, logout, register, refresh, me }),
    [user, login, logout, register, refresh, me],
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  )
}