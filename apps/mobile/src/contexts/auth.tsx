import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import { ICreateUserDto, IUser } from '@org/shared-types';
import { ApiService } from '../services/api/api.service';
import { AuthTokenStorageService } from '../services/auth-token-storage.service';

export type User = {
  email: string;
};
type Login = (user: User) => void;
type Logout = () => void;
type Register = (user: ICreateUserDto) => Promise<{ success: boolean }>;
type Refresh = () => void;
type Me = () => void;

type AuthContextType = {
  user: User | undefined;
  login: Login;
  logout: Logout;
  register: Register;
  refresh: Refresh;
  me: Me;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider() {
  const [user, setUser] = useState<User | undefined>(undefined);

  const login = (user: User) => {
    // Buscar na API
    setUser(user);
  };

  const logout = () => {
    // Buscar na API
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
    try {
      const response = await ApiService.Users.me();
      if (!response.ok) {
        throw new Error('Request Failed');
      }

      const user = (await response.json()) as IUser;
      console.log({ user });
    } catch (error) {
      console.log(error);
    }
  }, []);

  const value: AuthContextType = useMemo(
    () => ({ user, login, logout, register, refresh, me }),
    [user, login, logout, register, refresh, me],
  );

  const Provider = ({ children }: { children: ReactNode }) => {
    return (
      <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
  };

  const useAuthContext = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
      throw new Error(
        'useAuthContext deve ser utilizado dentro de AuthProvider',
      );
    }
    return context as AuthContextType;
  };

  return { Provider, useAuthContext } as const;
}
