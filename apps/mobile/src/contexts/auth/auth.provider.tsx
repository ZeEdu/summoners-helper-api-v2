import { ReactNode, useCallback, useMemo, useState } from "react";
import { ICreateUserDto, ILoginUserDto, IUser } from "@org/shared-libs";
import { ApiService } from "../../services/api/api.service";
import { AuthTokenStorageService } from "../../services/auth-token-storage.service";
import { AuthContext, AuthContextType } from "./auth.context";

type AuthProviderProps = {
  children: ReactNode
}

export default function AuthProvider({ children }: AuthProviderProps) {
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
      console.log('authProvider => login');
      console.log({ error });
      return { success: false, errors: {} };
    }
  };

  const logout = async () => {
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
      console.log({ error });
      return { success: false, errors: 'Não foi possivel recuperar os dados do usuário' };
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

      const userFromRequest = response as IUser;
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