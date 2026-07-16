import { ApiService } from "./services/api/api.service";
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
) => {
  try {
    const response = await fetch(url, init)
    if (!response.ok) {
      return handleError(url, init, state)
    }
    return response.json()
  } catch (err) {
    console.log({ err });
    throw new Error('Request failed')
  }
}

const handleError = (
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
  // TODO E casos de erro como os de dados falhos de formulário, o que irá acontecer
  const { retryCount = 0, refreshToken } = state

  if (retryCount < 3) {
    return customFetch(url, init, { ...state, retryCount: retryCount + 1 })
  }

  if (!refreshToken) {
    return handleRefreshToken(url, init, state)
  }
  AuthTokenStorageService.delete()
  throw new Error('Request failed')
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

  return customFetch(url, updatedInit, { refreshToken: true })
}

// TODO Retry 3 vezes
// TODO tokenRefresh automatico em caso de falha
// -- alterar o back para criar tokens com tempos irrisórios de validade