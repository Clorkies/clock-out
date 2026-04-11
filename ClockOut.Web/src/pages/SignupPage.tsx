import { Link } from 'react-router-dom'

function SignupPage() {
  return (
    <main className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-[var(--bg)] px-4 py-8 text-[var(--text)] md:px-8">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[8%] top-[-7rem] h-[18rem] w-[24rem] rounded-full bg-[var(--accent-glow)] blur-[110px]" />
        <div className="absolute bottom-[-10rem] right-[8%] h-[18rem] w-[24rem] rounded-full bg-[var(--accent-glow-strong)] blur-[115px]" />
      </div>

      <section className="relative mx-auto grid w-full max-w-6xl items-stretch overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)]/92 shadow-[var(--hero-shadow)] backdrop-blur lg:grid-cols-[1.02fr_0.98fr]">
        <div className="p-6 sm:p-8 md:p-10">
          <div className="mb-8 flex items-center justify-between">
            <Link to="/" className="text-sm font-medium text-[var(--muted)] hover:text-[var(--accent)]">
              Back
            </Link>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
              Sign up
            </p>
            <Link
              to="/login"
              className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs font-semibold text-[var(--muted)] transition hover:text-[var(--text)]"
            >
              I have an account
            </Link>
          </div>

          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Create your ClockOut workspace
          </h1>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Get your team up and running with smarter hour tracking.
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
              <label htmlFor="workEmail" className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                Work email
              </label>
              <input
                id="workEmail"
                name="workEmail"
                type="email"
                autoComplete="email"
                placeholder="you@company.com"
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3.5 py-2.5 text-sm placeholder:text-[var(--muted)]/70 focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/25"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="company" className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                Company / team
              </label>
              <input
                id="company"
                name="company"
                type="text"
                autoComplete="organization"
                placeholder="ClockOut Team"
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3.5 py-2.5 text-sm placeholder:text-[var(--muted)]/70 focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/25"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="newPassword" className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                Password
              </label>
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                autoComplete="new-password"
                placeholder="Create a secure password"
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3.5 py-2.5 text-sm placeholder:text-[var(--muted)]/70 focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/25"
              />
            </div>

            <label className="sm:col-span-2 flex items-start gap-2.5 text-sm leading-relaxed text-[var(--muted)]">
              <input
                type="checkbox"
                className="mt-0.5 h-4 w-4 rounded border-[var(--border)] bg-[var(--surface)] accent-[var(--accent)]"
              />
              I agree to the terms and privacy policy.
            </label>

            <button
              type="submit"
              className="sm:col-span-2 w-full rounded-xl border border-[var(--accent)] bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            >
              Create account
            </button>
          </form>
        </div>

        <aside className="hidden border-l border-[var(--border)] bg-[var(--panel)]/80 p-8 lg:flex lg:flex-col">
          <Link to="/" className="inline-flex w-fit items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-[var(--accent)] text-[11px] font-bold text-white">
              CO
            </div>
            <span className="text-base font-semibold tracking-tight">ClockOut</span>
          </Link>

          <div className="mt-10 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--card-shadow)]">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
              What you get
            </p>
            <ul className="mt-4 space-y-3 text-sm text-[var(--muted)]">
              <li>Unified clock-in/clock-out records.</li>
              <li>Clear attendance and overtime visibility.</li>
              <li>Payroll-friendly exports for faster cutoffs.</li>
            </ul>
          </div>

          <div className="mt-auto rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
              Already registered?
            </p>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Jump back in and continue where your team left off.
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
