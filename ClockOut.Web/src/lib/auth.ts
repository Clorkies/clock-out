import type { AuthResponse, UserSummary } from '../types/api'

export const AUTH_STORAGE_KEY = 'clockout_auth'

export type AuthState = {
  accessToken: string
  expiresAtUtc: string
  user: UserSummary
}

function isAuthState(value: unknown): value is AuthState {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const candidate = value as Partial<AuthState>
  return (
    typeof candidate.accessToken === 'string' &&
    typeof candidate.expiresAtUtc === 'string' &&
    typeof candidate.user === 'object' &&
    candidate.user !== null
  )
}

export function getAuthState(): AuthState | null {
  if (typeof window === 'undefined') {
    return null
  }

  const raw = window.localStorage.getItem(AUTH_STORAGE_KEY)
  if (!raw) {
    return null
  }

  try {
    const parsed: unknown = JSON.parse(raw)
    if (!isAuthState(parsed)) {
      return null
    }

    return parsed
  } catch {
    return null
  }
}

export function setAuthState(auth: AuthResponse): void {
  if (typeof window === 'undefined') {
    return
  }

  const state: AuthState = {
    accessToken: auth.accessToken,
    expiresAtUtc: auth.expiresAtUtc,
    user: auth.user,
  }

  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(state))
}

export function clearAuthState(): void {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.removeItem(AUTH_STORAGE_KEY)
}

export function getAccessToken(): string | null {
  const state = getAuthState()
  if (!state) {
    return null
  }

  const expiresAt = new Date(state.expiresAtUtc).getTime()
  if (!Number.isFinite(expiresAt) || expiresAt <= Date.now()) {
    clearAuthState()
    return null
  }

  return state.accessToken
}

export function isAuthenticated(): boolean {
  return getAccessToken() !== null
}

export function updateStoredUser(user: UserSummary): void {
  const state = getAuthState()
  if (!state || typeof window === 'undefined') {
    return
  }

  const next: AuthState = {
    ...state,
    user,
  }

  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(next))
}
