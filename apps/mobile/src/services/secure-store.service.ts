import * as SecureStore from 'expo-secure-store'

export const SecureStoreService = {
  get: async (key: string) => {
    return SecureStore.getItemAsync(key)
  },
  set: async (key: string, value: any) => {
    await SecureStore.setItemAsync(key, value)
  },
  delete: async (key: string) => {
    await SecureStore.deleteItemAsync(key)
  }
}