import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ThemeToggle from '../components/ThemeToggle'
import type { ThemeMode, ResolvedTheme } from '../hooks/useTheme'

type LandingPageProps = {
  theme: ThemeMode
  resolvedTheme: ResolvedTheme
  setTheme: (theme: ThemeMode) => void
}

const floatingCards = [
  {
    title: 'Daily Focus',
    body: 'Track hours and stay aligned with sprint goals.',
    className: '-left-4 top-24 rotate-[-8deg] md:-left-16',
  },
  {
    title: 'Solo Focus',
    body: 'Realtime updates for your active sessions and progress.',
    className: '-right-5 top-40 rotate-[6deg] md:-right-20',
  },
  {
    title: 'Insights',
    body: 'Generate payroll-ready summaries in one click.',
    className: 'bottom-20 -left-6 rotate-[5deg] md:-left-12',
  },
]

const heroLines = [
  'Time tracking,',
  'scheduling, and',
  'insights that',
  'feel effortless.',
] as const
const fullHeroHeading = heroLines.join(' ')
const heroLineEndOffsets = heroLines.reduce<number[]>((acc, line, index) => {
  const previous = index === 0 ? 0 : acc[index - 1]
  acc.push(previous + line.length)
  return acc
}, [])
const heroTypingTotalChars = heroLineEndOffsets[heroLineEndOffsets.length - 1]

/** Hero preview card: cap 300h, 67% filled → 201h (nice round joke with 67% attendance). */
const OVERVIEW_CAP_HOURS = 300
const OVERVIEW_LOGGED_HOURS = Math.round(OVERVIEW_CAP_HOURS * 0.67)
const OVERVIEW_ATTENDANCE_PCT = 67
const OVERVIEW_HOURS_PROGRESS =
  OVERVIEW_LOGGED_HOURS / OVERVIEW_CAP_HOURS

function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3
}

function LandingPage({
  theme,
  resolvedTheme,
  setTheme,
}: LandingPageProps) {
  const [typedChars, setTypedChars] = useState(0)
  const [overviewT, setOverviewT] = useState(0)

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    if (reduceMotion) {
      setOverviewT(1)
      return
    }

    const durationMs = 1400
    const start = performance.now()
    let raf = 0

    const step = (now: number) => {
      const elapsed = now - start
      const linear = Math.min(1, elapsed / durationMs)
      setOverviewT(easeOutCubic(linear))
      if (linear < 1) raf = requestAnimationFrame(step)
    }

    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [])

  const animatedHours = Math.round(overviewT * OVERVIEW_LOGGED_HOURS)
  const animatedAttendance = Math.round(overviewT * OVERVIEW_ATTENDANCE_PCT)
  const animatedBarPercent = overviewT * OVERVIEW_HOURS_PROGRESS * 100

  useEffect(() => {
    const totalChars = heroTypingTotalChars
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    if (reduceMotion) {
      setTypedChars(totalChars)
      return
    }

    setTypedChars(0)
    const intervalId = window.setInterval(() => {
      setTypedChars((current) => {
        if (current >= totalChars) {
          window.clearInterval(intervalId)
          return current
        }

        return current + 1
      })
    }, 26)

    return () => window.clearInterval(intervalId)
  }, [])

  const getTypedLine = (lineIndex: number) => {
    const start = lineIndex === 0 ? 0 : heroLineEndOffsets[lineIndex - 1]
    const end = heroLineEndOffsets[lineIndex]
    const currentCount = Math.max(0, Math.min(typedChars - start, end - start))
    return heroLines[lineIndex].slice(0, currentCount)
  }

  const typedLine1 = getTypedLine(0)
  const typedLine2 = getTypedLine(1)
  const typedLine3 = getTypedLine(2)
  const typedLine4 = getTypedLine(3)
  const line4Prefix = 'feel '
  const typedLine4Prefix = typedLine4.slice(
    0,
    Math.min(typedLine4.length, line4Prefix.length),
  )
  const typedLine4Keyword = typedLine4.slice(line4Prefix.length)
  const activeTypingLine =
    typedChars >= heroTypingTotalChars
      ? heroLines.length - 1
      : heroLineEndOffsets.findIndex((end) => typedChars < end)

  return (
    <div
      id="top"
      className="relative min-h-screen overflow-x-clip bg-[var(--bg)] text-[var(--text)]"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-8rem] h-[22rem] w-[34rem] -translate-x-1/2 rounded-full bg-[var(--accent-glow)] blur-[110px]" />
        <div className="absolute bottom-[-11rem] right-[-5rem] h-[24rem] w-[24rem] rounded-full bg-[var(--accent-glow-strong)] blur-[110px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pt-3 md:px-8 md:pt-4">
        <div className="flex min-h-svh flex-col pb-10 pt-20 md:pb-14 md:pt-24">
        <div className="fixed inset-x-0 top-3 z-40 md:top-4">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
        <header className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)]/85 px-3 py-2 shadow-[var(--card-shadow)] backdrop-blur md:px-4 supports-[backdrop-filter]:bg-[var(--surface)]/70">
          <a href="#top" className="flex items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-[var(--accent)] text-[11px] font-bold text-white shadow-[var(--card-shadow)]">
              CO
            </div>
            <span className="text-base font-semibold tracking-tight">ClockOut</span>
          </a>

          <div className="hidden items-center gap-5 text-xs font-semibold tracking-[0.04em] text-[var(--muted)] md:flex">
            <a
              href="#features"
              className="rounded-md px-1 py-1 transition duration-200 hover:font-bold hover:text-[var(--text)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="rounded-md px-1 py-1 transition duration-200 hover:font-bold hover:text-[var(--text)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            >
              Process
            </a>
            <a
              href="#contact"
              className="rounded-md px-1 py-1 transition duration-200 hover:font-bold hover:text-[var(--text)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            >
              Contact
            </a>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs font-semibold text-[var(--muted)] transition duration-200 hover:-translate-y-0.5 hover:text-[var(--text)] hover:shadow-[var(--card-shadow)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="rounded-lg border border-[var(--accent)] bg-[var(--accent)] px-3 py-1.5 text-xs font-semibold text-white transition duration-200 hover:-translate-y-0.5 hover:brightness-110 hover:shadow-[var(--card-shadow)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            >
              Sign up
            </Link>
            <ThemeToggle
              theme={theme}
              resolvedTheme={resolvedTheme}
              setTheme={setTheme}
            />
          </div>
        </header>
          </div>
        </div>

        <main className="grid min-h-0 flex-1 items-start gap-6 py-10 sm:py-12 md:py-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-10 lg:py-20">
          <section className="relative z-10"> 
            <p className="mb-6 inline-flex rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)] shadow-[var(--card-shadow)]">
              Your personal rhythm
            </p>

            <h1
              aria-label={fullHeroHeading}
              className="relative max-w-2xl text-4xl font-black leading-[1.06] tracking-tight md:text-6xl"
            >
              <span aria-hidden="true" className="invisible block">
                <span className="block">Time tracking,</span>
                <span className="block">scheduling, and</span>
                <span className="block">insights that</span>
                <span className="block">
                  feel{' '}
                  <span
                    className="inline-flex items-center bg-[var(--accent-soft)] px-2 py-0.5 text-[var(--accent)] md:py-1"
                    style={{ borderRadius: '16px 0px 0px 16px' }}
                  >
                    effortless.
                  </span>
                </span>
              </span>

              <span aria-hidden="true" className="absolute inset-0">
                <span className="block">
                  {typedLine1}
                  {activeTypingLine === 0 ? (
                    <span className="ml-0.5 inline-block h-[1.05em] w-[3.5px] animate-caret-blink bg-[var(--accent)] align-[-0.22em]" />
                  ) : null}
                </span>
                <span className="block">
                  {typedLine2}
                  {activeTypingLine === 1 ? (
                    <span className="ml-0.5 inline-block h-[1.05em] w-[3.5px] animate-caret-blink bg-[var(--accent)] align-[-0.22em]" />
                  ) : null}
                </span>
                <span className="block">
                  {typedLine3}
                  {activeTypingLine === 2 ? (
                    <span className="ml-0.5 inline-block h-[1.05em] w-[3.5px] animate-caret-blink bg-[var(--accent)] align-[-0.22em]" />
                  ) : null}
                </span>
                <span className="block">
                  {typedLine4Prefix}
                  {typedLine4Keyword.length > 0 ? (
                    <span
                      className="relative inline-flex items-center bg-[var(--accent-soft)] px-2 py-0.5 align-baseline text-[var(--accent)] md:py-1"
                      style={{ borderRadius: '16px 0px 0px 16px' }}
                    >
                      {typedLine4Keyword}
                      {activeTypingLine === 3 ? (
                        <span
                          aria-hidden="true"
                          className="animate-caret-blink absolute -right-[3.5px] top-1/2 h-[calc(100%+10px)] w-[3.5px] -translate-y-1/2 bg-[var(--accent)]"
                        />
                      ) : null}
                    </span>
                  ) : null}
                  {activeTypingLine === 3 && typedLine4Keyword.length === 0 ? (
                    <span className="ml-0.5 inline-block h-[1.05em] w-[3.5px] animate-caret-blink bg-[var(--accent)] align-[-0.22em]" />
                  ) : null}
                </span>
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-[var(--muted)]">
              ClockOut gives you one command center for shifts, attendance, and
              payroll-friendly records, with a product style you will actually
              enjoy using.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/signup"
                className="rounded-xl border border-[var(--accent)] bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white shadow-[var(--card-shadow)] transition duration-200 hover:-translate-y-0.5 hover:brightness-110 hover:shadow-[var(--hero-shadow)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
              >
                Start tracking
              </Link>
              <a
                href="#features"
                className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-6 py-3 text-sm font-semibold text-[var(--text)] transition duration-200 hover:-translate-y-0.5 hover:border-[var(--accent-soft)] hover:text-[var(--accent)] hover:shadow-[var(--card-shadow)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
              >
                Explore features
              </a>
            </div>
          </section>

          <section className="relative">
            {floatingCards.map((card, index) => (
              <article
                key={card.title}
                className={`animate-fade-up absolute hidden w-52 rounded-2xl border border-[var(--border)] bg-[var(--surface)]/85 p-4 shadow-[var(--card-shadow)] backdrop-blur transition-transform duration-300 hover:-translate-y-1 hover:scale-[1.01] md:block ${card.className}`}
                style={{ animationDelay: `${0.1 + index * 0.12}s` }}
              >
                <p className="text-sm font-semibold text-[var(--accent)]">{card.title}</p>
                <p className="mt-2 text-xs leading-relaxed text-[var(--muted)]">
                  {card.body}
                </p>
              </article>
            ))}

            <div className="animate-fade-up-delay-2 relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--hero-shadow)] transition-transform duration-300 hover:-translate-y-1 hover:shadow-[var(--card-shadow)]">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
                    ClockOut Overview
                  </p>
                  <p className="mt-2 text-xl font-semibold">Weekly Activity Overview</p>
                </div>
                <div className="rounded-full border border-[var(--accent-soft)] bg-[var(--accent-soft)] px-3 py-1 text-xs font-semibold text-[var(--accent)]">
                  Live
                </div>
              </div>

              <div className="grid gap-3">
                <div className="rounded-xl border border-[var(--border)] bg-[var(--panel)] p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-sm font-semibold">Hours Logged</p>
                    <p className="text-sm font-semibold text-[var(--accent)] tabular-nums">
                      {animatedHours}h
                    </p>
                  </div>
                  <div className="h-2 rounded-full bg-[var(--track)]">
                    <div
                      className="h-2 rounded-full bg-[var(--accent)]"
                      style={{ width: `${animatedBarPercent}%` }}
                    />
                  </div>
                  <p className="mt-1.5 text-[10px] font-medium uppercase tracking-wider text-[var(--muted)]">
                    of {OVERVIEW_CAP_HOURS}h cap
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-[var(--border)] bg-[var(--panel)] p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
                      Attendance
                    </p>
                    <p className="mt-2 text-2xl font-bold tabular-nums text-[var(--text)]">
                      {animatedAttendance}%
                    </p>
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
                    4 OJT folks checked in, one is &ldquo;just finishing the
                    module&rdquo; since breakfast, and your mentor still owes a
                    signature on yesterday&apos;s shadow log.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </main>
        </div>

        <section id="features" className="scroll-mt-28 items-center justify-center pt-8 pb-10 md:pt-12 md:pb-16 lg:pt-16">
          <div className="mb-5 flex items-center justify-center text-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
                Features
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">
                Built to support every shift
              </h2>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <article className="min-h-[23rem] rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--card-shadow)] transition-transform duration-300 hover:-translate-y-1 hover:shadow-[var(--hero-shadow)]">
              <div className="mb-5 flex h-44 items-center justify-center rounded-xl border border-dashed border-[var(--border)] bg-[var(--panel)]/60">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                  Scheduling Preview
                </p>
              </div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
                Scheduling
              </p>
              <h3 className="mt-2 text-lg font-semibold">Plan faster</h3>
              <p className="mt-2 text-sm text-[var(--muted)]">
                Build shift templates and publish updates with clear personal visibility.
              </p>
            </article>

            <article className="min-h-[23rem] rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--card-shadow)] transition-transform duration-300 hover:-translate-y-1 hover:shadow-[var(--hero-shadow)]">
              <div className="mb-5 flex h-44 items-center justify-center rounded-xl border border-dashed border-[var(--border)] bg-[var(--panel)]/60">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                  Attendance Preview
                </p>
              </div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
                Attendance
              </p>
              <h3 className="mt-2 text-lg font-semibold">Track with confidence</h3>
              <p className="mt-2 text-sm text-[var(--muted)]">
                Audit-ready entries, break visibility, and anomaly highlights.
              </p>
            </article>

            <article className="min-h-[23rem] rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--card-shadow)] transition-transform duration-300 hover:-translate-y-1 hover:shadow-[var(--hero-shadow)]">
              <div className="mb-5 flex h-44 items-center justify-center rounded-xl border border-dashed border-[var(--border)] bg-[var(--panel)]/60">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                  Insights Preview
                </p>
              </div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
                Insights
              </p>
              <h3 className="mt-2 text-lg font-semibold">Review in seconds</h3>
              <p className="mt-2 text-sm text-[var(--muted)]">
                Keep timesheets and summaries ready for payroll and personal records.
              </p>
            </article>
          </div>
        </section>

        <section
          id="how-it-works"
          className="relative isolate scroll-mt-28 pt-12 pb-14 md:pt-16 md:pb-20"
        >
          <div className="pointer-events-none absolute inset-x-6 inset-y-4 -z-10 md:inset-x-12">
            <div className="absolute left-[18%] top-10 h-44 w-44 rounded-full bg-[var(--accent-glow)]/80 blur-[70px]" />
            <div className="absolute right-[16%] bottom-12 h-48 w-48 rounded-full bg-[var(--accent-glow-strong)]/70 blur-[85px]" />
          </div>
          <div className="mb-5 items-center justify-center text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
              How it works
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">
              Input to output in three simple steps
            </h2>
          </div>

          <div className="mx-auto grid w-full max-w-5xl gap-4 md:grid-cols-[minmax(0,15rem)_auto_minmax(0,15rem)_auto_minmax(0,15rem)] md:items-stretch md:justify-center">
            <article className="w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--card-shadow)] transition-transform duration-300 hover:-translate-y-1 hover:shadow-[var(--hero-shadow)]">
              <div className="mb-5 rounded-xl border border-[var(--border)] bg-[var(--panel)] p-4">
                <div className="h-3 w-2/3 rounded-md bg-[var(--text)]/90" />
                <div className="mt-3 h-2.5 w-1/2 rounded bg-[var(--muted)]/30" />
                <div className="mt-2 h-2.5 w-3/4 rounded bg-[var(--muted)]/25" />
                <div className="mt-3 flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-[var(--accent)]/90" />
                  <div className="h-2.5 flex-1 rounded bg-[var(--muted)]/25" />
                </div>
              </div>

              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
                Input
              </p>
              <h3 className="mt-2 text-lg font-semibold">Create account</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                Sign in, set up details, and add shift notes when needed.
              </p>
            </article>

            <div className="hidden items-center justify-center text-xl font-semibold text-[var(--muted)] md:flex">
              <span aria-hidden="true">→</span>
            </div>

            <article className="w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--card-shadow)] transition-transform duration-300 hover:-translate-y-1 hover:shadow-[var(--hero-shadow)]">
              <div className="mb-5 rounded-xl border border-[var(--border)] bg-[var(--panel)] p-4">
                <div className="flex items-center justify-between">
                  <div className="h-3 w-1/3 rounded-md bg-[var(--text)]/90" />
                  <div className="h-3 w-1/4 rounded-md bg-[var(--accent)]/80" />
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  <div className="h-2.5 rounded bg-emerald-300/80" />
                  <div className="h-2.5 rounded bg-sky-300/80" />
                  <div className="h-2.5 rounded bg-[var(--muted)]/25" />
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <div className="h-4 w-4 rounded-full bg-[var(--accent)]" />
                  <div className="h-2.5 flex-1 rounded bg-[var(--muted)]/30" />
                </div>
              </div>

              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
                Process
              </p>
              <h3 className="mt-2 text-lg font-semibold">Log your hours</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                ClockOut validates entries, computes totals, and keeps records clean.
              </p>
            </article>

            <div className="hidden items-center justify-center text-xl font-semibold text-[var(--muted)] md:flex">
              <span aria-hidden="true">→</span>
            </div>

            <article className="w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--card-shadow)] transition-transform duration-300 hover:-translate-y-1 hover:shadow-[var(--hero-shadow)]">
              <div className="mb-5 rounded-xl border border-[var(--border)] bg-[var(--panel)] p-4">
                <div className="h-3 w-2/3 rounded-md bg-[var(--text)]/90" />
                <div className="mt-4 grid grid-cols-4 gap-2">
                  <div className="h-14 rounded bg-emerald-500/90" />
                  <div className="h-10 rounded bg-sky-500/90" />
                  <div className="h-8 rounded bg-emerald-400/90" />
                  <div className="h-11 rounded bg-blue-400/90" />
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  <div className="h-2 rounded bg-[var(--muted)]/30" />
                  <div className="h-2 rounded bg-[var(--muted)]/30" />
                  <div className="h-2 rounded bg-[var(--muted)]/30" />
                </div>
              </div>

              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
                Output
              </p>
              <h3 className="mt-2 text-lg font-semibold">Track progress</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                Review summaries and export insights for payroll or personal records.
              </p>
            </article>
          </div>
        </section>
      </div>

      <footer id="contact" className="relative mt-8 scroll-mt-28 border-t border-[var(--border)] md:mt-10">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 md:grid-cols-[1.4fr_1fr] md:items-stretch md:px-8 md:py-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
              ClockOut
            </p>
            <h2 className="mt-2 text-xl font-bold tracking-tight">
              Built for clear, reliable time tracking
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-[var(--muted)]">
              ClockOut helps you track work hours accurately, monitor attendance,
              and turn daily records into payroll-ready outputs with less manual effort.
            </p>
          </div>

          <div className="flex h-full min-h-0 flex-col items-end justify-end text-sm text-[var(--muted)]">
            <div className="flex items-center gap-2.5 md:mt-0">
              <a
                href="https://github.com/Clorkies/clock-out"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="grid h-9 w-9 place-items-center rounded-full border border-[var(--border)] text-[var(--muted)] transition duration-200 hover:-translate-y-0.5 hover:border-[var(--accent-soft)] hover:text-[var(--accent)]"
              >
                <svg viewBox="0 0 24 24" className="h-4.5 w-4.5 fill-current" aria-hidden="true">
                  <path d="M12 .5C5.648.5.5 5.648.5 12a11.5 11.5 0 0 0 7.86 10.918c.574.105.783-.249.783-.555 0-.273-.01-.997-.016-1.957-3.197.695-3.872-1.54-3.872-1.54-.523-1.328-1.278-1.682-1.278-1.682-1.045-.715.079-.7.079-.7 1.156.081 1.764 1.187 1.764 1.187 1.027 1.76 2.695 1.252 3.352.958.104-.744.402-1.252.732-1.54-2.551-.29-5.234-1.275-5.234-5.675 0-1.253.448-2.279 1.183-3.082-.118-.29-.512-1.458.112-3.04 0 0 .965-.31 3.162 1.177a10.99 10.99 0 0 1 5.758 0c2.195-1.486 3.159-1.178 3.159-1.178.626 1.583.233 2.75.115 3.041.737.803 1.181 1.829 1.181 3.082 0 4.411-2.687 5.381-5.247 5.666.413.356.781 1.057.781 2.13 0 1.537-.014 2.777-.014 3.154 0 .309.206.666.79.553A11.503 11.503 0 0 0 23.5 12C23.5 5.648 18.352.5 12 .5Z" />
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/in/clark-modequillo"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="grid h-9 w-9 place-items-center rounded-full border border-[var(--border)] text-[var(--muted)] transition duration-200 hover:-translate-y-0.5 hover:border-[var(--accent-soft)] hover:text-[var(--accent)]"
              >
                <svg viewBox="0 0 24 24" className="h-4.5 w-4.5 fill-current" aria-hidden="true">
                  <path d="M4.98 3.5A2.48 2.48 0 1 0 5 8.46a2.48 2.48 0 0 0-.02-4.96ZM2.75 9.75h4.5v11.75h-4.5V9.75Zm7.25 0h4.31v1.6h.06c.6-1.14 2.07-2.35 4.26-2.35 4.56 0 5.4 3 5.4 6.9v5.6h-4.5v-4.96c0-1.19-.02-2.71-1.65-2.71-1.66 0-1.91 1.29-1.91 2.62v5.05H10V9.75Z" />
                </svg>
              </a>
              <a
                href="mailto:clarkmodequillo434@gmail.com"
                aria-label="Email"
                className="grid h-9 w-9 place-items-center rounded-full border border-[var(--border)] text-[var(--muted)] transition duration-200 hover:-translate-y-0.5 hover:border-[var(--accent-soft)] hover:text-[var(--accent)]"
              >
                <svg viewBox="0 0 24 24" className="h-4.5 w-4.5 fill-current" aria-hidden="true">
                  <path d="M3.75 5.25h16.5a1.5 1.5 0 0 1 1.5 1.5v10.5a1.5 1.5 0 0 1-1.5 1.5H3.75a1.5 1.5 0 0 1-1.5-1.5V6.75a1.5 1.5 0 0 1 1.5-1.5Zm0 2.09v.21l8.25 5.5 8.25-5.5v-.21H3.75Zm16.5 9.91V9.34l-7.84 5.22a.75.75 0 0 1-.82 0L3.75 9.34v7.91h16.5Z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-[var(--border)]">
          <div className="mx-auto max-w-7xl px-4 py-4 text-xs text-[var(--muted)] md:flex md:items-center md:justify-between md:px-8">
            <p>© 2026 ClockOut. All rights reserved.</p>
            <p>
              Crafted by{' '}
              <a
                href="https://clorky.dev"
                target="_blank"
                rel="noreferrer"
                className="font-bold text-[var(--text)] underline-offset-2 transition duration-200 hover:text-[var(--accent)] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
              >
                Clorky
              </a>
              .
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
