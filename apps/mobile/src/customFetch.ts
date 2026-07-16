import { ApiService } from "./services/api/api.service"
import { AuthTokenStorageService } from "./services/auth-token-storage.service"

export const customFetch = async (
  url: string,
  init: RequestInit,
  state: {
    retryCount?: number,
    refreshToken?: boolean,
  } = {
      retryCount: 0,
      refreshToken: false,
    }
): Promise<Response> => {
  console.log('Custom fetch');

  return fetch(url, init).catch((err: any) => {
    // TODO E casos de erro como os de dados falhos de formulário, o que irá acontecer
    const { retryCount = 0, refreshToken } = state
    if (retryCount < 3) {
      return customFetch(url, init, { retryCount: retryCount + 1 })
    }
    if (err?.statusCode === 401 && !refreshToken) {
      return handleRefreshToken(url, init, state)
    }
    throw new Error('Failed')
  })
}

const handleRefreshToken = async (
  url: string,
  init: RequestInit,
  state: {
    retryCount?: number,
    refreshToken?: boolean,
  } = {
      retryCount: 0,
      refreshToken: false,
    }
) => {
  try {
    const response = await ApiService.Auth.refreshToken()
    const {
      accessToken,
      refreshToken,
    }: { accessToken: string; refreshToken: string } = await response.json();

    await AuthTokenStorageService.set(accessToken, refreshToken);

    const updatedInit: RequestInit = {
      ...init,
      headers: {
        ...init.headers,
        Authorization: `Bearer ${accessToken}`,
      },
    };

    return customFetch(url, updatedInit, { ...state, refreshToken: true })
  } catch {
    // TODO Tratar melhor esse caso de erro
    await AuthTokenStorageService.delete()
    throw new Error('Failed')
  }
}

// TODO Retry 3 vezes
// TODO tokenRefresh automatico em caso de falha
// -- alterar o back para criar tokens com tempos irrisórios de validade