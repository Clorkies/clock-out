import { type FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ApiError, login } from '../lib/api'
import { setAuthState } from '../lib/auth'

function LoginPage() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [googleMessage, setGoogleMessage] = useState<string | null>(null)

  const handleGoogleSignIn = () => {
    setGoogleMessage('Google sign-in is not available yet. Please use email and password.')
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage(null)
    setGoogleMessage(null)
    setIsSubmitting(true)

    try {
      const auth = await login({
        email: email.trim(),
        password,
      })

      setAuthState(auth)
      navigate('/dashboard', { replace: true })
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.message)
      } else {
        setErrorMessage('Unable to sign in right now. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--bg)] px-4 py-8 text-[var(--text)]">
      <div className="w-full max-w-md">
        <div className="mb-4 flex justify-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-[var(--muted)]/80 transition hover:bg-[var(--surface)] hover:text-[var(--muted)] focus-visible:bg-[var(--surface)] focus-visible:outline-none"
          >
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back
          </Link>
        </div>

        <h2 className="text-center text-2xl font-bold tracking-tight sm:text-3xl">Sign in to ClockOut</h2>
        <p className="mt-2 text-center text-sm text-[var(--muted)]">
          Use your email and password to continue.
        </p>

        <section className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--card-shadow)] sm:p-8">
        <form
          className="space-y-4"
          onSubmit={handleSubmit}
        >
          {errorMessage && (
            <p className="rounded-lg border border-rose-400/50 bg-rose-500/10 px-3 py-2 text-sm text-rose-500">
              {errorMessage}
            </p>
          )}
          {googleMessage && (
            <p className="rounded-lg border border-amber-400/50 bg-amber-500/10 px-3 py-2 text-sm text-amber-500">
              {googleMessage}
            </p>
          )}
          <div>
            <label htmlFor="email" className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3.5 py-2.5 text-sm text-[var(--text)] placeholder:text-[var(--muted)]/70 focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/25"
              required
            />
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                Password
              </label>
              <button type="button" className="text-xs font-semibold text-[var(--accent)] hover:brightness-110">
                Forgot?
              </button>
            </div>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="Enter password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3.5 py-2.5 pr-11 text-sm text-[var(--text)] placeholder:text-[var(--muted)]/70 focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/25"
                minLength={8}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                className="absolute inset-y-0 right-0 my-auto mr-3 grid h-8 w-8 place-items-center rounded-lg text-[var(--muted)] transition hover:bg-[var(--surface)] hover:text-[var(--text)]"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M3 3l18 18" />
                    <path d="M10.58 10.58A2 2 0 0012 14a2 2 0 001.42-.58" />
                    <path d="M9.88 5.09A10.94 10.94 0 0112 5c5 0 9 5 9 7a11.8 11.8 0 01-2.16 3.19" />
                    <path d="M6.24 6.24C3.73 7.8 2 10.21 2 12c0 2 4 7 10 7a11.7 11.7 0 005.06-1.17" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <label className="flex items-center gap-2.5 text-sm text-[var(--muted)]">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-[var(--border)] bg-[var(--surface)] accent-[var(--accent)]"
            />
            Keep me signed in
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl border border-[var(--accent)] bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
          >
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </button>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm font-semibold text-[var(--text)] transition hover:border-[var(--accent)]/45 hover:bg-[var(--panel)]"
          >
            <svg viewBox="0 0 48 48" className="h-4 w-4" aria-hidden="true">
              <path
                fill="#FFC107"
                d="M43.611 20.083H42V20H24v8h11.303A12.01 12.01 0 0124 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.96 3.04l5.657-5.657A19.888 19.888 0 0024 4C12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
              />
              <path
                fill="#FF3D00"
                d="M6.306 14.691l6.571 4.819A11.965 11.965 0 0124 12c3.059 0 5.842 1.154 7.96 3.04l5.657-5.657A19.888 19.888 0 0024 4c-7.682 0-14.344 4.337-17.694 10.691z"
              />
              <path
                fill="#4CAF50"
                d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.935 11.935 0 0124 36c-5.201 0-9.62-3.317-11.283-7.946l-6.522 5.025A19.983 19.983 0 0024 44z"
              />
              <path
                fill="#1976D2"
                d="M43.611 20.083H42V20H24v8h11.303a12.05 12.05 0 01-5.993 6.571l6.19 5.238C39.793 36.139 44 30.55 44 24c0-1.341-.138-2.65-.389-3.917z"
              />
            </svg>
            Sign in with Google
          </button>
        </form>

        <p className="mt-6 text-sm text-[var(--muted)]">
          New to ClockOut?{' '}
          <Link to="/signup" className="font-semibold text-[var(--accent)] hover:brightness-110">
            Create your account
          </Link>
        </p>
        </section>
      </div>
    </main>
  )
}

export default LoginPage
