import {
  NavigationContainer, DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme
} from '@react-navigation/native';
import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { adaptNavigationTheme, MD3DarkTheme, MD3LightTheme, PaperProvider } from "react-native-paper";
import { useAuthContext } from "../contexts/auth/useAuth";
import { ThemeStorageService } from "../services/theme-storage.service";

const { LightTheme: NavigationAdaptedLightTheme, DarkTheme: NavigationAdaptedDarkTheme } = adaptNavigationTheme({
  reactNavigationLight: NavigationDefaultTheme,
  reactNavigationDark: NavigationDarkTheme,
});

type ThemeContextType = {
  toggleTheme: () => void,
  isThemeDark: boolean
}

const ThemeContext = createContext({
  toggleTheme: () => { },
  isThemeDark: false
})

export default function ThemeProvider({ children }: PropsWithChildren) {
  const authContext = useAuthContext();

  const [isThemeDark, setIsThemeDark] = useState(false)
  let paperTheme = isThemeDark ? MD3DarkTheme : MD3LightTheme
  let navigationTheme = isThemeDark ? NavigationAdaptedDarkTheme : NavigationAdaptedLightTheme

  const toggleTheme = useCallback(() => {
    setIsThemeDark(previous => {
      const next = !previous;
      ThemeStorageService.setIsDarkTheme(next);
      return next;
    });
  }, []);

  const preferences = useMemo(() => ({ toggleTheme, isThemeDark }), [toggleTheme, isThemeDark])

  useEffect(() => {
    async function checkThemePreference() {
      if (authContext.user) {
        const isDarkTheme = await ThemeStorageService.isDarkTheme()

        if (!isThemeDark && isDarkTheme) {
          toggleTheme()
        }
      }
    }

    checkThemePreference()
  }, [authContext.user])

  return (
    <ThemeContext.Provider value={preferences}>
      <PaperProvider theme={paperTheme}>
        <NavigationContainer theme={navigationTheme}>
          {children}
        </NavigationContainer>
      </PaperProvider>
    </ThemeContext.Provider>
  )
}

export const useThemeContext = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error(
      'useThemeContext deve ser utilizado dentro de ThemeProvider',
    );
  }
  return context as ThemeContextType;
};