export const customFetch = (
  url: string,
  init: RequestInit,
  state: {
    retryCount: number
  } = { retryCount: 0 }
) => {
  return fetch(url, init).catch((err: unknown) => {
    const { retryCount } = state
    if (retryCount < 3) {
      return customFetch(url, init, { retryCount: retryCount + 1 })
    }
  })
}

// TODO Retry 3 vezes
// TODO tokenRefresh automatico em caso de falha
// -- alterar o back para criar tokens com tempos irrisórios de validade
