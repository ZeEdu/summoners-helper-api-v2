import { SecureStoreService } from "./secure-store.service"


const ACCESS_TOKEN = 'access_token'
const REFRESH_TOKEN = 'refresh_token'

export const AuthTokenStorageService = {
  set: async (accessToken: string, refreshToken: string) => {
    await SecureStoreService.set(ACCESS_TOKEN, accessToken)
    await SecureStoreService.set(REFRESH_TOKEN, refreshToken)
  },
  get: async () => {
    const accessToken = await SecureStoreService.get(ACCESS_TOKEN)
    const refreshToken = await SecureStoreService.get(REFRESH_TOKEN)

    return { accessToken, refreshToken }
  },
  delete: async () => {
    await SecureStoreService.delete(ACCESS_TOKEN)
    await SecureStoreService.delete(REFRESH_TOKEN)
  }
}