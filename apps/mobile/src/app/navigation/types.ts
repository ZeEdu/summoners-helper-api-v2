import { NavigatorScreenParams } from "@react-navigation/native";

import { IGuide } from "@org/contracts";

export const Stacks = {
  Main: 'Main',
  Auth: 'Auth',
  Modals: 'Modals',
  Loading: 'Loading',
  Error: 'Error'
} as const

export const Routes = {
  Home: 'Home',
  Profile: 'Profile',
  MyGuides: 'MyGuides',

  Login: 'Login',
  Register: 'Register',

  BindRiotAccount: 'BindRiotAccount',
  CreateGuide: 'CreateGuide',
  ViewGuide: 'ViewGuide'
} as const

export type RootStackParamList = {
  [Stacks.Main]: NavigatorScreenParams<MainTabsParamList>;
  [Stacks.Auth]: NavigatorScreenParams<AuthStackParamList>;
  [Stacks.Modals]: NavigatorScreenParams<ModalStackParamList>;
  [Stacks.Loading]: undefined;
  [Stacks.Error]: undefined
};

export type MainTabsParamList = {
  [Routes.Home]: undefined;
  [Routes.Profile]: { userId: string };
  [Routes.MyGuides]: undefined,
};

export type AuthStackParamList = {
  [Routes.Register]: undefined;
  [Routes.Login]: undefined;
};

export type ModalStackParamList = {
  [Routes.BindRiotAccount]: undefined;
  [Routes.CreateGuide]: { guide?: IGuide };
  [Routes.ViewGuide]: { guide: IGuide };
};