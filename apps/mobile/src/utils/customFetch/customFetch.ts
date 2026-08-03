import { Platform } from "react-native";
import { AuthEvents } from "../../auth-events";
import { ApiService } from "../../services/api/api.service";
import { AuthTokenStorageService } from "../../services/auth-token-storage.service";

// ────────────────────────────────────────────────────────────────────────────
// Tipos
// ────────────────────────────────────────────────────────────────────────────

interface FetchState {
  retryCount?: number;
  /** Indica que essa requisição já é uma repetição pós-refresh de token */
  isRetryAfterRefresh?: boolean;
}

interface FetchOptions {
  /** Tempo máximo (ms) aguardando a resposta antes de abortar */
  timeoutMs?: number;
}

interface RefreshTokenResponse {
  accessToken: string;
  refreshToken?: string;
}

interface FailedRequestInfo {
  status: number;
  body: unknown;
}

// ────────────────────────────────────────────────────────────────────────────
// Erros
// ────────────────────────────────────────────────────────────────────────────

/** Sessão realmente expirada: refresh falhou ou já foi tentado sem sucesso. */
export class SessionExpiredError extends Error {
  constructor(message = "Sessão expirada") {
    super(message);
    this.name = "SessionExpiredError";
  }
}

/**
 * O servidor respondeu, mas com um status de erro que não é auth
 * (validação de formulário, recurso não encontrado, conflito de negócio, etc).
 * Carrega status + corpo para quem chamou decidir o que fazer.
 */
export class FailedRequestError extends Error {
  readonly status: number;
  readonly body: unknown;

  constructor(info: FailedRequestInfo, message = `Requisição falhou com status ${info.status}`) {
    super(message);
    this.name = "FailedRequestError";
    this.status = info.status;
    this.body = info.body;
  }
}

/** fetch nunca chegou a se conectar ao servidor (sem rede, DNS, host recusou, etc). */
export class NetworkError extends Error {
  constructor(cause: unknown) {
    super("Falha de rede ao tentar completar a requisição");
    this.name = "NetworkError";
    this.cause = cause;
  }
}

/** A requisição foi abortada por exceder o timeout configurado. */
export class RequestTimeoutError extends Error {
  constructor(timeoutMs: number) {
    super(`Requisição abortada após ${timeoutMs}ms`);
    this.name = "RequestTimeoutError";
  }
}

// ────────────────────────────────────────────────────────────────────────────
// Configuração
// ────────────────────────────────────────────────────────────────────────────

const MAX_RETRY_COUNT = 3;
const BASE_BACKOFF_MS = 300;

const DEFAULT_STATE: Required<FetchState> = {
  retryCount: 0,
  isRetryAfterRefresh: false,
};

const DEFAULT_OPTIONS: Required<FetchOptions> = {
  timeoutMs: 10_000,
};

// Métodos que o próprio HTTP define como seguros/idempotentes: reenviar não
// muda o resultado final. POST e PATCH ficam de fora de propósito.
const IDEMPOTENT_METHODS = new Set(["GET", "HEAD", "OPTIONS", "PUT", "DELETE"]);

const isRetryableStatus = (status: number): boolean => {
  return status === 429 || (status >= 500 && status <= 599);
};

const getMethod = (init: RequestInit): string => (init.method ?? "GET").toUpperCase();

const isIdempotent = (init: RequestInit): boolean => IDEMPOTENT_METHODS.has(getMethod(init));

const wait = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

const backoffDelay = (retryCount: number): number => BASE_BACKOFF_MS * 2 ** retryCount;

/** Aceita Headers, array de tuplas ou objeto plano e devolve sempre um Headers novo. */
const mergeHeaders = (base: HeadersInit | undefined, extra: Record<string, string>): Headers => {
  const merged = new Headers(base);
  for (const [key, value] of Object.entries(extra)) {
    merged.set(key, value);
  }
  return merged;
};

/** 204/205/304 ou corpo vazio não têm JSON — não deve estourar erro. */
const parseJsonSafely = async (response: Response): Promise<unknown> => {
  const text = await response.text();
  if (!text) return undefined;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

// ────────────────────────────────────────────────────────────────────────────
// Mutex de refresh — garante uma única renovação em voo mesmo com N chamadas
// concorrentes recebendo 401 ao mesmo tempo.
// ────────────────────────────────────────────────────────────────────────────

let refreshPromise: Promise<{ accessToken: string }> | null = null;

const getOrCreateRefresh = (): Promise<{ accessToken: string }> => {
  if (!refreshPromise) {
    refreshPromise = doRefreshToken().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
};

const doRefreshToken = async (): Promise<{ accessToken: string }> => {
  let response: Response;
  try {
    response = await ApiService.Auth.refreshToken();
  } catch (err) {
    await AuthTokenStorageService.delete();
    AuthEvents.emitSessionExpired();
    throw new SessionExpiredError();
  }

  if (!response.ok) {
    await AuthTokenStorageService.delete();
    AuthEvents.emitSessionExpired();
    throw new SessionExpiredError();
  }

  const { accessToken, refreshToken }: RefreshTokenResponse = await response.json();

  if (Platform.OS === 'web') {
    await AuthTokenStorageService.set(accessToken);
  } else {
    await AuthTokenStorageService.set(accessToken, refreshToken);
  }

  return { accessToken };
};

// ────────────────────────────────────────────────────────────────────────────
// customFetch
// ────────────────────────────────────────────────────────────────────────────

export const customFetch = async <T = unknown>(
  url: string,
  init: RequestInit = {},
  options: FetchOptions = DEFAULT_OPTIONS,
  state: FetchState = DEFAULT_STATE
): Promise<T> => {
  const { retryCount = 0, isRetryAfterRefresh = false } = state;
  const timeoutMs = options.timeoutMs ?? DEFAULT_OPTIONS.timeoutMs;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  let response: Response;
  try {
    response = await fetch(url, { ...init, signal: controller.signal });
  } catch (err) {
    clearTimeout(timeoutId);
    return handleFetchFailure<T>(err, url, init, options, state, timeoutMs);
  }
  clearTimeout(timeoutId);

  // 401 → tentativa de renovar o token. Independe do método/idempotência,
  // porque a requisição original nunca chegou a ser processada pela lógica
  // de negócio — refazê-la uma vez com o token novo é seguro.
  if (response.status === 401) {
    if (isRetryAfterRefresh) {
      // Já tentamos renovar e refazer uma vez; um segundo 401 é sessão inválida de fato.
      await AuthTokenStorageService.delete();
      AuthEvents.emitSessionExpired();
      throw new SessionExpiredError();
    }
    return handleRefreshToken<T>(url, init, options, state);
  }

  if (!response.ok) {
    if (isRetryableStatus(response.status) && isIdempotent(init) && retryCount < MAX_RETRY_COUNT) {
      await wait(backoffDelay(retryCount));
      return customFetch<T>(url, init, options, { ...state, retryCount: retryCount + 1 });
    }

    const body = await parseJsonSafely(response);
    throw new FailedRequestError({ status: response.status, body });
  }

  return parseJsonSafely(response) as Promise<T>;
};

const handleFetchFailure = async <T>(
  err: unknown,
  url: string,
  init: RequestInit,
  options: FetchOptions,
  state: FetchState,
  timeoutMs: number
): Promise<T> => {
  const { retryCount = 0 } = state;

  if (err instanceof DOMException && err.name === "AbortError") {
    throw new RequestTimeoutError(timeoutMs);
  }

  // Falha de rede real (sem conexão, DNS, host recusou conexão, etc).
  // Só retentamos automaticamente se o método for idempotente.
  if (isIdempotent(init) && retryCount < MAX_RETRY_COUNT) {
    await wait(backoffDelay(retryCount));
    return customFetch<T>(url, init, options, { ...state, retryCount: retryCount + 1 });
  }

  throw new NetworkError(err);
};

const handleRefreshToken = async <T>(
  url: string,
  init: RequestInit,
  options: FetchOptions,
  state: FetchState
): Promise<T> => {
  const { accessToken } = await getOrCreateRefresh();

  const updatedInit: RequestInit = {
    ...init,
    headers: mergeHeaders(init.headers, { Authorization: `Bearer ${accessToken}` }),
  };

  // retryCount reseta de propósito: é um novo ciclo de tentativas com
  // credenciais válidas, não uma continuação das tentativas anteriores.
  return customFetch<T>(url, updatedInit, options, {
    retryCount: 0,
    isRetryAfterRefresh: true,
  });
};