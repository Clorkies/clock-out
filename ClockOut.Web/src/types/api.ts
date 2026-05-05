export type UserSummary = {
  id: number
  email: string
  firstName: string
  lastName: string
  requiredHours: number
  createdAt: string
}

export type AuthResponse = {
  accessToken: string
  expiresAtUtc: string
  user: UserSummary
}

export type LoginRequest = {
  email: string
  password: string
}

export type RegisterRequest = {
  email: string
  password: string
  firstName: string
  lastName: string
}

export type UpdateMeRequest = {
  firstName: string
  lastName: string
  requiredHours: number
}

export type LogEntry = {
  id: number
  date: string
  hoursRendered: number
  taskDescription: string
  supervisorName: string
  createdAt: string
  updatedAt: string
}

export type CreateLogEntryRequest = {
  date: string
  hoursRendered: number
  taskDescription: string
  supervisorName: string
}

export type UpdateLogEntryRequest = CreateLogEntryRequest

export type LogSummary = {
  requiredHours: number
  totalHoursLogged: number
  remainingHours: number
  percentComplete: number
  entryCount: number
}

export type ProblemDetails = {
  title?: string
  detail?: string
  status?: number
  errors?: Record<string, string[]>
}
