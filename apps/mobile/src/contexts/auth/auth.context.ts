import { CreateUserDto, ICreateUserDto, ILoginUserDto, IUser } from "@org/shared-libs";
import { createContext } from "react";

type Login = (user: ILoginUserDto) => Promise<{ success: boolean }>;
type Logout = () => Promise<void>;
type Register = (user: ICreateUserDto) => Promise<{ success: boolean, errors?: Partial<{ [K in keyof CreateUserDto]: string[] }> }>;
type Me = () => Promise<IUser | undefined>;

export type AuthContextType = {
  user: IUser | undefined;
  login: Login;
  logout: Logout;
  register: Register;
  me: Me;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);