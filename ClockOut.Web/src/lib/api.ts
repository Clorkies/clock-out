import { clearAuthState, getAccessToken } from './auth'
import type {
  AuthResponse,
  CreateLogEntryRequest,
  LogEntry,
  LogSummary,
  LoginRequest,
  ProblemDetails,
  RegisterRequest,
  UpdateLogEntryRequest,
  UpdateMeRequest,
  UserSummary,
} from '../types/api'

const API_BASE_URL = (import.meta.env.VITE_API_URL as string | undefined)
  ?.trim()
  ?.replace(/\/+$/, '')

export class ApiError extends Error {
  readonly status: number
  readonly details: ProblemDetails | null

  constructor(status: number, message: string, details: ProblemDetails | null) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.details = details
  }
}

async function parseJsonSafe<T>(response: Response): Promise<T | null> {
  try {
    return (await response.json()) as T
  } catch {
    return null
  }
}

async function request<T>(
  path: string,
  init: RequestInit = {},
  options: { requiresAuth?: boolean } = {},
): Promise<T> {
  if (!API_BASE_URL) {
    throw new ApiError(
      500,
      'Missing VITE_API_URL. Configure your frontend environment variables and redeploy.',
      null,
    )
  }

  const headers = new Headers(init.headers)
  if (!headers.has('Content-Type') && init.body) {
    headers.set('Content-Type', 'application/json')
  }

  if (options.requiresAuth) {
    const token = getAccessToken()
    if (!token) {
      throw new ApiError(401, 'Your session has expired. Please sign in again.', null)
    }

    headers.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
  })

  if (!response.ok) {
    const details = await parseJsonSafe<ProblemDetails>(response)
    const message = details?.detail || details?.title || 'Request failed'

    if (response.status === 401) {
      clearAuthState()
      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        window.location.replace('/login')
      }
    }

    throw new ApiError(response.status, message, details)
  }

  if (response.status === 204) {
    return undefined as T
  }

  const body = await parseJsonSafe<T>(response)
  if (body === null) {
    throw new ApiError(response.status, 'Failed to parse server response.', null)
  }

  return body
}

export function login(payload: LoginRequest): Promise<AuthResponse> {
  return request<AuthResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function register(payload: RegisterRequest): Promise<AuthResponse> {
  return request<AuthResponse>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function getMe(): Promise<UserSummary> {
  return request<UserSummary>('/api/me', {}, { requiresAuth: true })
}

export function updateMe(payload: UpdateMeRequest): Promise<UserSummary> {
  return request<UserSummary>(
    '/api/me',
    {
      method: 'PUT',
      body: JSON.stringify(payload),
    },
    { requiresAuth: true },
  )
}

export function getLogs(): Promise<LogEntry[]> {
  return request<LogEntry[]>('/api/logs', {}, { requiresAuth: true })
}

export function createLog(payload: CreateLogEntryRequest): Promise<LogEntry> {
  return request<LogEntry>(
    '/api/logs',
    {
      method: 'POST',
      body: JSON.stringify(payload),
    },
    { requiresAuth: true },
  )
}

export function updateLog(id: number, payload: UpdateLogEntryRequest): Promise<LogEntry> {
  return request<LogEntry>(
    `/api/logs/${id}`,
    {
      method: 'PUT',
      body: JSON.stringify(payload),
    },
    { requiresAuth: true },
  )
}

export function deleteLog(id: number): Promise<void> {
  return request<void>(
    `/api/logs/${id}`,
    {
      method: 'DELETE',
    },
    { requiresAuth: true },
  )
}

export function getSummary(): Promise<LogSummary> {
  return request<LogSummary>('/api/logs/summary', {}, { requiresAuth: true })
}
