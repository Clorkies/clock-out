import { Link } from 'react-router-dom'
import ThemeToggle from '../components/ThemeToggle'
import type { ThemeMode, ResolvedTheme } from '../hooks/useTheme'

type LandingPageProps = {
  theme: ThemeMode
  resolvedTheme: ResolvedTheme
  setTheme: (theme: ThemeMode) => void
  toggleTheme: () => void
}

const floatingCards = [
  {
    title: 'Daily Focus',
    body: 'Track hours and stay aligned with sprint goals.',
    className: '-left-4 top-24 rotate-[-8deg] md:-left-16',
  },
  {
    title: 'Team Pulse',
    body: 'Realtime updates for every active shift and project.',
    className: '-right-5 top-40 rotate-[6deg] md:-right-20',
  },
  {
    title: 'Reports',
    body: 'Generate payroll-ready summaries in one click.',
    className: 'bottom-20 -left-6 rotate-[5deg] md:-left-12',
  },
]

function LandingPage({
  theme,
  resolvedTheme,
  setTheme,
  toggleTheme,
}: LandingPageProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--bg)] text-[var(--text)]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-8rem] h-[22rem] w-[34rem] -translate-x-1/2 rounded-full bg-[var(--accent-glow)] blur-[110px]" />
        <div className="absolute bottom-[-11rem] right-[-5rem] h-[24rem] w-[24rem] rounded-full bg-[var(--accent-glow-strong)] blur-[110px]" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-4 pb-12 pt-6 md:px-8">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-[var(--accent)] text-sm font-bold text-white shadow-[var(--card-shadow)]">
              CO
            </div>
            <div>
              <p className="text-lg font-semibold tracking-tight">ClockOut</p>
              <p className="text-xs text-[var(--muted)]">Time tracking that feels modern.</p>
            </div>
          </Link>

          <ThemeToggle
            theme={theme}
            resolvedTheme={resolvedTheme}
            setTheme={setTheme}
            toggleTheme={toggleTheme}
          />
        </header>

        <main className="grid flex-1 items-center gap-10 pt-10 md:pt-14 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="relative z-10">
            <p className="mb-6 inline-flex rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)] shadow-[var(--card-shadow)]">
              Your team's new rhythm
            </p>

            <h1 className="max-w-2xl text-balance text-4xl font-black leading-[1.06] tracking-tight md:text-6xl">
              Time tracking, scheduling, and reporting that feels{' '}
              <span className="rounded-2xl bg-[var(--accent-soft)] px-2 text-[var(--accent)]">
                effortless
              </span>
              .
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-[var(--muted)]">
              ClockOut gives managers and teams one command center for shifts,
              attendance, and payroll-friendly records, with a product style
              your team will actually enjoy using.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/dashboard"
                className="rounded-xl border border-[var(--accent)] bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white shadow-[var(--card-shadow)] transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
              >
                Open Dashboard
              </Link>
              <a
                href="#features"
                className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-6 py-3 text-sm font-semibold text-[var(--text)] transition hover:border-[var(--accent-soft)] hover:text-[var(--accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
              >
                Explore features
              </a>
            </div>
          </section>

          <section className="relative">
            {floatingCards.map((card) => (
              <article
                key={card.title}
                className={`absolute hidden w-52 rounded-2xl border border-[var(--border)] bg-[var(--surface)]/85 p-4 shadow-[var(--card-shadow)] backdrop-blur md:block ${card.className}`}
              >
                <p className="text-sm font-semibold text-[var(--accent)]">{card.title}</p>
                <p className="mt-2 text-xs leading-relaxed text-[var(--muted)]">
                  {card.body}
                </p>
              </article>
            ))}

            <div className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--hero-shadow)]">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
                    ClockOut Overview
                  </p>
                  <p className="mt-2 text-xl font-semibold">Weekly Team Activity</p>
                </div>
                <div className="rounded-full border border-[var(--accent-soft)] bg-[var(--accent-soft)] px-3 py-1 text-xs font-semibold text-[var(--accent)]">
                  Live
                </div>
              </div>

              <div className="grid gap-3">
                <div className="rounded-xl border border-[var(--border)] bg-[var(--panel)] p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-sm font-semibold">Hours Logged</p>
                    <p className="text-sm font-semibold text-[var(--accent)]">92h</p>
                  </div>
                  <div className="h-2 rounded-full bg-[var(--track)]">
                    <div className="h-2 w-4/5 rounded-full bg-[var(--accent)]" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-[var(--border)] bg-[var(--panel)] p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
                      Attendance
                    </p>
                    <p className="mt-2 text-2xl font-bold text-[var(--text)]">97%</p>
                  </div>
                  <div className="rounded-xl border border-[var(--border)] bg-[var(--panel)] p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
                      Tasks Closed
                    </p>
                    <p className="mt-2 text-2xl font-bold text-[var(--text)]">124</p>
                  </div>
                </div>

                <div className="rounded-xl border border-[var(--border)] bg-[var(--panel)] p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
                    Today
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                    5 people clocked in, 2 shifts ending within 45 minutes, and
                    payroll export is ready for approval.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </main>

        <section id="features" className="mt-10 grid gap-3 md:grid-cols-3">
          <article className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--card-shadow)]">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
              Scheduling
            </p>
            <h2 className="mt-2 text-lg font-semibold">Plan faster</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Build shift templates and publish updates with clear team visibility.
            </p>
          </article>
          <article className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--card-shadow)]">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
              Attendance
            </p>
            <h2 className="mt-2 text-lg font-semibold">Track with confidence</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Audit-ready entries, break visibility, and anomaly highlights.
            </p>
          </article>
          <article className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--card-shadow)]">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
              Reporting
            </p>
            <h2 className="mt-2 text-lg font-semibold">Export in seconds</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Share timesheets and summaries with payroll and finance teams.
            </p>
          </article>
        </section>
      </div>
    </div>
  )
}

export default LandingPage
