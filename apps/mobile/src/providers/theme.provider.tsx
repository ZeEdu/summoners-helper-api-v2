import { createContext, PropsWithChildren, useCallback, useMemo, useState } from "react";
import { adaptNavigationTheme, MD3DarkTheme, MD3LightTheme, PaperProvider } from "react-native-paper";
import { NavigationContainer } from '@react-navigation/native';
import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';

const { LightTheme: NavigationAdaptedLightTheme, DarkTheme: NavigationAdaptedDarkTheme } = adaptNavigationTheme({
  reactNavigationLight: NavigationDefaultTheme,
  reactNavigationDark: NavigationDarkTheme,
});

export const ThemeContext = createContext({
  toggleTheme: () => { },
  isThemeDark: true
})

export default function ThemeProvider({ children }: PropsWithChildren) {
  const [isThemeDark, setIsThemeDark] = useState(true)
  let paperTheme = isThemeDark ? MD3DarkTheme : MD3LightTheme
  let navigationTheme = isThemeDark ? NavigationAdaptedDarkTheme : NavigationAdaptedLightTheme

  const toggleTheme = useCallback(() => setIsThemeDark(!isThemeDark), [isThemeDark])
  const preferences = useMemo(() => ({ toggleTheme, isThemeDark }), [toggleTheme, isThemeDark])

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