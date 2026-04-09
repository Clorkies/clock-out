import { Link } from 'react-router-dom'

function LoginPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--bg)] px-4 py-8 text-[var(--text)] md:px-8">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[12%] top-[-6rem] h-[18rem] w-[22rem] rounded-full bg-[var(--accent-glow)] blur-[100px]" />
        <div className="absolute bottom-[-9rem] right-[6%] h-[18rem] w-[22rem] rounded-full bg-[var(--accent-glow-strong)] blur-[110px]" />
      </div>

      <section className="relative mx-auto grid w-full max-w-6xl items-stretch overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)]/92 shadow-[var(--hero-shadow)] backdrop-blur lg:grid-cols-[0.95fr_1.05fr]">
        <aside className="hidden border-r border-[var(--border)] bg-[var(--panel)]/80 p-8 lg:flex lg:flex-col">
          <Link to="/" className="inline-flex w-fit items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-[var(--accent)] text-[11px] font-bold text-white">
              CO
            </div>
            <span className="text-base font-semibold tracking-tight">ClockOut</span>
          </Link>

          <div className="mt-10">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
              Welcome back
            </p>
            <h1 className="mt-3 text-3xl font-black leading-tight tracking-tight">
              Manage shifts with clarity and confidence.
            </h1>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-[var(--muted)]">
              Sign in to review attendance, approve entries, and keep payroll-ready
              records in one place.
            </p>
          </div>

          <div className="mt-auto grid gap-3">
            {[
              'Realtime team activity snapshots',
              'Exportable attendance and hour reports',
              'Clean workflow for managers and teams',
            ].map((item) => (
              <div
                key={item}
                className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--muted)]"
              >
                {item}
              </div>
            ))}
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
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="Enter password"
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3.5 py-2.5 text-sm text-[var(--text)] placeholder:text-[var(--muted)]/70 focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/25"
              />
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
