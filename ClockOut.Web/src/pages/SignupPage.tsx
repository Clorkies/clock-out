import { Link } from 'react-router-dom'

function SignupPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--bg)] px-4 text-[var(--text)]">
      <section className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-7 text-center shadow-[var(--card-shadow)]">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
          ClockOut
        </p>
        <h1 className="mt-3 text-2xl font-bold">Sign up coming soon</h1>
        <Link
          to="/"
          className="mt-6 inline-flex rounded-lg border border-[var(--accent)] bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
        >
          Back to landing
        </Link>
      </section>
    </main>
  )
}

export default SignupPage
