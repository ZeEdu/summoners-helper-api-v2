import { NavigatorScreenParams } from "@react-navigation/native";

export const Stacks = {
  Main: 'Main',
  Auth: 'Auth',
  Modals: 'Modals'
} as const

export const Routes = {
  Home: 'Home',
  Profile: 'Profile',
  MyBuilds: 'MyBuilds',

  Login: 'Login',
  Register: 'Register',

  BindRiotAccount: 'BindRiotAccount'
} as const

export type RootStackParamList = {
  [Stacks.Main]: NavigatorScreenParams<MainTabsParamList>;
  [Stacks.Auth]: NavigatorScreenParams<AuthStackParamList>;
  [Stacks.Modals]: NavigatorScreenParams<ModalStackParamList>;
};

export type MainTabsParamList = {
  [Routes.Home]: undefined;
  [Routes.Profile]: { userId: string };
  [Routes.MyBuilds]: undefined,
};

export type AuthStackParamList = {
  [Routes.Register]: undefined;
  [Routes.Login]: undefined;
};

export type ModalStackParamList = {
  [Routes.BindRiotAccount]: undefined;
};