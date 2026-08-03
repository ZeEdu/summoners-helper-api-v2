import SecureStoreService from "./secure-store.service"

const THEME_KEY = 'theme_key'
export const ThemeStorageService = {
  setIsDarkTheme: async (isDarkTheme: boolean) => {
    await SecureStoreService.set(THEME_KEY, isDarkTheme ? 'true' : 'false')
  },
  isDarkTheme: async () => {
    const isDarkTheme = await SecureStoreService.get(THEME_KEY)
    return isDarkTheme !== undefined && isDarkTheme === 'true'
  },
}