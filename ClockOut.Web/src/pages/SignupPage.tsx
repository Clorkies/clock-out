import { useState } from 'react'
import { Link } from 'react-router-dom'

function SignupPage() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <main className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-[var(--bg)] px-4 py-8 text-[var(--text)] md:px-8">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[8%] top-[-7rem] h-[18rem] w-[24rem] rounded-full bg-[var(--accent-glow)] blur-[110px]" />
        <div className="absolute bottom-[-10rem] right-[8%] h-[18rem] w-[24rem] rounded-full bg-[var(--accent-glow-strong)] blur-[115px]" />
      </div>

      <section className="relative mx-auto grid w-full max-w-6xl items-stretch overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)]/92 shadow-[var(--hero-shadow)] backdrop-blur lg:grid-cols-[1.02fr_0.98fr]">
        <div className="order-2 p-6 sm:p-8 md:p-10">
          <div className="mb-8 flex items-center">
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

          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Create your ClockOut account
          </h1>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Start tracking your hours and attendance in one place.
          </p>

          <form
            className="mt-7 grid gap-4 sm:grid-cols-2"
            onSubmit={(event) => event.preventDefault()}
          >
            <div>
              <label htmlFor="firstName" className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                First name
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                autoComplete="given-name"
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3.5 py-2.5 text-sm focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/25"
              />
            </div>

            <div>
              <label htmlFor="lastName" className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                Last name
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                autoComplete="family-name"
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3.5 py-2.5 text-sm focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/25"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="email" className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3.5 py-2.5 text-sm placeholder:text-[var(--muted)]/70 focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/25"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="newPassword" className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                Password
              </label>
              <div className="relative">
                <input
                  id="newPassword"
                  name="newPassword"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Create a secure password"
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3.5 py-2.5 pr-11 text-sm placeholder:text-[var(--muted)]/70 focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/25"
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

            <button
              type="submit"
              className="sm:col-span-2 w-full rounded-xl border border-[var(--accent)] bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            >
              Create account
            </button>

            <button
              type="button"
              className="sm:col-span-2 flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm font-semibold text-[var(--text)] transition hover:border-[var(--accent)]/45 hover:bg-[var(--panel)]"
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
              Sign up with Google
            </button>
          </form>
        </div>

        <aside className="order-1 relative hidden overflow-hidden border-r border-[var(--border)] bg-[var(--panel)]/80 p-8 lg:flex lg:flex-col">
          <Link to="/" className="inline-flex w-fit items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-[var(--accent)] text-[11px] font-bold text-white">
              CO
            </div>
            <span className="text-base font-semibold tracking-tight">ClockOut</span>
          </Link>

          <div className="relative z-10 mt-10">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
              What you get
            </p>
            <ul className="mt-5 space-y-4">
              {[
                'Simple clock-in and clock-out records for your daily routine.',
                'Clear attendance and overtime visibility for your own hours.',
                'Quick export-ready data whenever you need your logs.',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-[var(--text)]/90">
                  <span className="mt-1 h-2 w-2 rounded-full bg-[var(--accent)] shadow-[0_0_16px_var(--accent)]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative z-10 mt-8 grid grid-cols-2 gap-3">
            {[
              { value: '4 min', label: 'Onboarding setup' },
              { value: '24/7', label: 'Access anytime' },
              { value: '100%', label: 'Export ready data' },
              { value: '1 place', label: 'Hours overview' },
            ].map((metric) => (
              <div key={metric.label} className="rounded-xl border border-[var(--border)]/70 bg-[var(--surface)]/55 px-3 py-2.5 backdrop-blur-sm">
                <p className="text-sm font-semibold text-[var(--text)]">{metric.value}</p>
                <p className="mt-0.5 text-[11px] uppercase tracking-[0.12em] text-[var(--muted)]">
                  {metric.label}
                </p>
              </div>
            ))}
          </div>

          <div className="relative z-10 mt-auto pt-6">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
              Already registered?
            </p>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Jump back in and continue where you left off.
            </p>
            <Link
              to="/login"
              className="mt-4 inline-flex rounded-lg border border-[var(--accent)] bg-[var(--accent)] px-3 py-2 text-xs font-semibold text-white transition hover:brightness-110"
            >
              Go to login
            </Link>
          </div>
        </aside>
      </section>
    </main>
  )
}

export default SignupPage
