import { useState } from 'react'
import { Link } from 'react-router-dom'

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)

  const handleGoogleSignIn = () => {
    console.info('Google sign-in placeholder clicked')
  }

  return (
    <main className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-[var(--bg)] px-4 py-8 text-[var(--text)] md:px-8">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[12%] top-[-6rem] h-[18rem] w-[22rem] rounded-full bg-[var(--accent-glow)] blur-[100px]" />
        <div className="absolute bottom-[-9rem] right-[6%] h-[18rem] w-[22rem] rounded-full bg-[var(--accent-glow-strong)] blur-[110px]" />
      </div>

      <section className="relative mx-auto grid w-full max-w-6xl items-stretch overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)]/92 shadow-[var(--hero-shadow)] backdrop-blur lg:grid-cols-[0.95fr_1.05fr]">
        <aside className="relative hidden overflow-hidden border-r border-[var(--border)] bg-[var(--panel)]/70 p-8 lg:flex lg:items-center lg:justify-center">
          <Link to="/" className="absolute left-8 top-8 inline-flex items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-[var(--accent)] text-[11px] font-bold text-white">
              CO
            </div>
            <span className="text-base font-semibold tracking-tight">ClockOut</span>
          </Link>

          <div className="pointer-events-none absolute inset-0">
            <div className="auth-blob auth-blob-1" />
            <div className="auth-blob auth-blob-2" />
            <div className="auth-blob auth-blob-3" />
            <div className="auth-blob auth-blob-4" />
          </div>

          <div className="relative z-10 grid h-[17rem] w-[17rem] place-items-center rounded-full border border-[var(--border)]/75 bg-[var(--surface)]/35 shadow-[var(--card-shadow)] backdrop-blur-sm">
            <div className="grid h-[12rem] w-[12rem] place-items-center rounded-full border border-[var(--border)]/70 bg-[var(--surface)]/40 auth-spin-slow">
              <div className="h-3.5 w-3.5 rounded-full bg-[var(--accent)] shadow-[0_0_26px_var(--accent)]" />
            </div>
          </div>
        </aside>

        <div className="p-6 sm:p-8 md:p-10">
          <div className="mb-8 flex items-center justify-between">
            <Link to="/" className="text-sm font-medium text-[var(--muted)] hover:text-[var(--accent)] lg:hidden">
              Back
            </Link>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
              Login
            </p>
            <Link
              to="/signup"
              className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs font-semibold text-[var(--muted)] transition hover:text-[var(--text)]"
            >
              Create account
            </Link>
          </div>

          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Sign in to ClockOut</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Use your work email and password to continue.
          </p>

          <form
            className="mt-7 space-y-4"
            onSubmit={(event) => event.preventDefault()}
          >
            <div>
              <label htmlFor="email" className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@company.com"
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3.5 py-2.5 text-sm text-[var(--text)] placeholder:text-[var(--muted)]/70 focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/25"
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
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3.5 py-2.5 pr-11 text-sm text-[var(--text)] placeholder:text-[var(--muted)]/70 focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/25"
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
              className="w-full rounded-xl border border-[var(--accent)] bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            >
              Sign in
            </button>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm font-semibold text-[var(--text)] transition hover:border-[var(--accent)]/45 hover:bg-[var(--panel)]"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                <path
                  fill="#EA4335"
                  d="M12 10.2v3.9h5.45c-.24 1.25-1.65 3.68-5.45 3.68-3.28 0-5.95-2.71-5.95-6.05s2.67-6.05 5.95-6.05c1.87 0 3.12.8 3.84 1.49l2.62-2.55C16.77 2.97 14.59 2 12 2 6.95 2 2.86 6.06 2.86 11.1S6.95 20.2 12 20.2c6.94 0 9.14-4.83 9.14-7.32 0-.49-.05-.85-.12-1.22H12z"
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
        </div>
      </section>
    </main>
  )
}

export default LoginPage
