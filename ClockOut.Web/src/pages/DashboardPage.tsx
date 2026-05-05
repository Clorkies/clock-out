import { useMemo, useState, type ChangeEvent, type FormEvent } from 'react'
import { Link } from 'react-router-dom'

// ─── Font injection (DM Sans + DM Mono) ──────────────────────────────────────
if (!document.getElementById('dashboard-fonts')) {
  const link = document.createElement('link')
  link.id = 'dashboard-fonts'
  link.rel = 'stylesheet'
  link.href =
    'https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=DM+Mono:wght@400;500&display=swap'
  document.head.appendChild(link)
}

const REQUIRED_HOURS = 300

type LogEntry = {
  id: string
  date: string
  hoursRendered: number
  taskDescription: string
  supervisorName: string
  createdAt: string
}

type LogForm = {
  date: string
  hoursRendered: string
  taskDescription: string
  supervisorName: string
}

type FormErrors = Partial<Record<keyof LogForm, string>>

const seededLogs: LogEntry[] = [
  {
    id: 'log-1',
    date: '2026-05-03',
    hoursRendered: 8,
    taskDescription: 'Implemented login validation and polished error handling.',
    supervisorName: 'Ms. Garcia',
    createdAt: '2026-05-03T09:00:00.000Z',
  },
  {
    id: 'log-2',
    date: '2026-05-02',
    hoursRendered: 7.5,
    taskDescription: 'Built signup layout and improved responsive spacing.',
    supervisorName: 'Ms. Garcia',
    createdAt: '2026-05-02T08:40:00.000Z',
  },
  {
    id: 'log-3',
    date: '2026-05-01',
    hoursRendered: 6.5,
    taskDescription: 'Reviewed API contracts for summary and log endpoints.',
    supervisorName: 'Mr. Reyes',
    createdAt: '2026-05-01T08:10:00.000Z',
  },
]

const initialForm: LogForm = {
  date: '',
  hoursRendered: '',
  taskDescription: '',
  supervisorName: '',
}

function formatHours(hours: number) {
  return Number.isInteger(hours) ? `${hours}` : hours.toFixed(1)
}

function formatDateLabel(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function sortLogsNewestFirst(logs: LogEntry[]) {
  return [...logs].sort((a, b) => {
    if (a.date === b.date) return b.createdAt.localeCompare(a.createdAt)
    return b.date.localeCompare(a.date)
  })
}

function getTodayDateInputValue() {
  const today = new Date()
  const yyyy = today.getFullYear()
  const mm = String(today.getMonth() + 1).padStart(2, '0')
  const dd = String(today.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

function validateForm(form: LogForm) {
  const errors: FormErrors = {}
  const parsedHours = Number(form.hoursRendered)
  if (!form.date) errors.date = 'Date is required.'
  if (!Number.isFinite(parsedHours) || parsedHours <= 0 || parsedHours > 24)
    errors.hoursRendered = 'Hours must be between 0.1 and 24.'
  if (!form.taskDescription.trim()) errors.taskDescription = 'Task description is required.'
  if (form.taskDescription.trim().length > 1000)
    errors.taskDescription = 'Task description must be 1000 characters or less.'
  if (!form.supervisorName.trim()) errors.supervisorName = 'Supervisor name is required.'
  if (form.supervisorName.trim().length > 150)
    errors.supervisorName = 'Supervisor name must be 150 characters or less.'
  return errors
}

const inputCls =
  'w-full rounded-md border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm transition ' +
  'focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 ' +
  'placeholder:text-[var(--muted)]/40'

function DashboardPage() {
  const [logs, setLogs] = useState<LogEntry[]>(seededLogs)
  const [form, setForm] = useState<LogForm>({ ...initialForm, date: getTodayDateInputValue() })
  const [formErrors, setFormErrors] = useState<FormErrors>({})
  const [editingId, setEditingId] = useState<string | null>(null)

  const orderedLogs = useMemo(() => sortLogsNewestFirst(logs), [logs])
  const totalHoursLogged = useMemo(() => logs.reduce((t, e) => t + e.hoursRendered, 0), [logs])
  const remainingHours = Math.max(0, REQUIRED_HOURS - totalHoursLogged)
  const percentCompleteRaw = REQUIRED_HOURS > 0 ? (totalHoursLogged / REQUIRED_HOURS) * 100 : 0
  const percentComplete = Math.min(100, percentCompleteRaw)

  const pageDateLabel = useMemo(
    () =>
      new Date().toLocaleDateString(undefined, {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      }),
    [],
  )

  const clearForm = () => {
    setForm({ ...initialForm, date: getTodayDateInputValue() })
    setFormErrors({})
    setEditingId(null)
  }

  const handleFieldChange =
    (field: keyof LogForm) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((c) => ({ ...c, [field]: event.target.value }))
      if (formErrors[field]) setFormErrors((c) => ({ ...c, [field]: undefined }))
    }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextErrors = validateForm(form)
    if (Object.keys(nextErrors).length > 0) {
      setFormErrors(nextErrors)
      return
    }
    const payload: Omit<LogEntry, 'id' | 'createdAt'> = {
      date: form.date,
      hoursRendered: Number(form.hoursRendered),
      taskDescription: form.taskDescription.trim(),
      supervisorName: form.supervisorName.trim(),
    }
    if (editingId) {
      setLogs((c) => c.map((e) => (e.id === editingId ? { ...e, ...payload } : e)))
      clearForm()
      return
    }
    const newEntry: LogEntry = {
      id:
        typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : `log-${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...payload,
    }
    setLogs((c) => [newEntry, ...c])
    clearForm()
  }

  const startEditing = (entry: LogEntry) => {
    setEditingId(entry.id)
    setForm({
      date: entry.date,
      hoursRendered: String(entry.hoursRendered),
      taskDescription: entry.taskDescription,
      supervisorName: entry.supervisorName,
    })
    setFormErrors({})
    document.getElementById('log-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const deleteEntry = (id: string) => {
    setLogs((c) => c.filter((e) => e.id !== id))
    if (editingId === id) clearForm()
  }

  return (
    <div
      className="relative min-h-screen overflow-x-hidden bg-[var(--bg)] text-[var(--text)]"
      style={{ fontFamily: '"DM Sans", system-ui, sans-serif' }}
    >
      {/* ── Ambient glow ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[5%] top-[-6rem] h-[22rem] w-[28rem] rounded-full bg-[var(--accent-glow)] opacity-70 blur-[140px]" />
        <div className="absolute bottom-[-8rem] right-[6%] h-[20rem] w-[26rem] rounded-full bg-[var(--accent-glow-strong)] opacity-60 blur-[130px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-6 md:px-8 md:py-8">

        {/* ════════════════════════════════
            HEADER — contained but slim
        ════════════════════════════════ */}
        <header className="relative mb-6 overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface)]/90 px-4 py-3 shadow-sm backdrop-blur-sm">
          {/* Hairline accent top bar */}
          <div className="absolute inset-x-0 top-0 h-[2px] bg-[var(--accent)]" />

          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link
              to="/"
              className="flex items-center gap-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            >
              <div className="grid h-8 w-8 place-items-center rounded-md bg-[var(--accent)] text-[11px] font-bold tracking-wider text-white shadow-sm">
                CO
              </div>
              <div className="leading-tight">
                <p className="text-sm font-semibold tracking-tight">ClockOut</p>
                <p className="text-[11px] text-[var(--muted)]">OJT Tracker · Dashboard</p>
              </div>
            </Link>

            <div className="flex flex-wrap items-center gap-2.5">
              <span className="hidden rounded-full border border-[var(--border)] bg-[var(--panel)] px-3 py-1 text-[11px] text-[var(--muted)] sm:inline-block">
                {pageDateLabel}
              </span>
              <button
                type="button"
                onClick={() =>
                  document.getElementById('log-form')?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                  })
                }
                className="rounded-md bg-[var(--accent)] px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
              >
                + Add log
              </button>
            </div>
          </div>
        </header>

        <main className="space-y-4">

          {/* ════════════════════════════════
              STATS — differentiated hierarchy
          ════════════════════════════════ */}
          <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">

            {/* PRIMARY stat — accent left border, larger numeral */}
            <article className="relative overflow-hidden rounded-lg border border-[var(--accent)]/35 bg-[var(--surface)] p-4 shadow-sm">
              <div className="absolute inset-y-0 left-0 w-[3px] bg-[var(--accent)]" />
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
                Total hours
              </p>
              <p className="mt-2 leading-none">
                <span
                  className="text-[2.6rem] font-bold tabular-nums"
                  style={{ fontFamily: '"DM Mono", monospace' }}
                >
                  {formatHours(totalHoursLogged)}
                </span>
                <span className="ml-1 text-lg font-medium text-[var(--muted)]">h</span>
              </p>
            </article>

            {/* SECONDARY stats */}
            {[
              { label: 'Remaining', value: formatHours(remainingHours), unit: 'h' },
              { label: 'Completion', value: percentCompleteRaw.toFixed(1), unit: '%' },
              { label: 'Entries', value: String(logs.length), unit: '' },
            ].map(({ label, value, unit }) => (
              <article
                key={label}
                className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm"
              >
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
                  {label}
                </p>
                <p className="mt-2 leading-none">
                  <span
                    className="text-3xl font-bold tabular-nums"
                    style={{ fontFamily: '"DM Mono", monospace' }}
                  >
                    {value}
                  </span>
                  {unit && (
                    <span className="ml-0.5 text-base font-medium text-[var(--muted)]">{unit}</span>
                  )}
                </p>
              </article>
            ))}
          </section>

          {/* ════════════════════════════════
              PROGRESS — single-row banner
          ════════════════════════════════ */}
          <section className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-5 py-4 shadow-sm">
            <div className="mb-2.5 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <div className="flex items-baseline gap-2">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
                  Progress to 300 hours
                </p>
                <p className="hidden text-[11px] text-[var(--muted)] sm:block">
                  · Keep adding logs to reach your OJT target.
                </p>
              </div>
              <p
                className="text-xs font-semibold tabular-nums text-[var(--text)]"
                style={{ fontFamily: '"DM Mono", monospace' }}
              >
                {formatHours(totalHoursLogged)}h &nbsp;/&nbsp; {REQUIRED_HOURS}h
              </p>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--track)]">
              <div
                className="h-full rounded-full bg-[var(--accent)] transition-all duration-500"
                style={{ width: `${percentComplete}%` }}
              />
            </div>
          </section>

          {/* ════════════════════════════════
              FORM + TABLE
          ════════════════════════════════ */}
          <section className="grid gap-4 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.35fr)]">

            {/* ── Form panel ── */}
            <article
              id="log-form"
              className="relative overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm"
            >
              {/* Top accent stripe */}
              <div className="absolute inset-x-0 top-0 h-[2px] bg-[var(--accent)]" />

              <div className="mb-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
                  {editingId ? 'Edit log entry' : 'Quick log entry'}
                </p>
                <h2 className="mt-1 text-base font-semibold">
                  {editingId ? 'Update your entry' : 'Add today\u2019s work log'}
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="date"
                      className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]"
                    >
                      Date
                    </label>
                    <input
                      id="date"
                      name="date"
                      type="date"
                      value={form.date}
                      onChange={handleFieldChange('date')}
                      className={inputCls}
                    />
                    {formErrors.date && (
                      <p className="mt-1 text-[11px] text-rose-500">{formErrors.date}</p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="hoursRendered"
                      className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]"
                    >
                      Hours rendered
                    </label>
                    <input
                      id="hoursRendered"
                      name="hoursRendered"
                      type="number"
                      min="0.1"
                      max="24"
                      step="0.1"
                      placeholder="8"
                      value={form.hoursRendered}
                      onChange={handleFieldChange('hoursRendered')}
                      className={inputCls}
                    />
                    {formErrors.hoursRendered && (
                      <p className="mt-1 text-[11px] text-rose-500">{formErrors.hoursRendered}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="taskDescription"
                    className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]"
                  >
                    Task description
                  </label>
                  <textarea
                    id="taskDescription"
                    name="taskDescription"
                    rows={4}
                    placeholder="What did you work on today?"
                    value={form.taskDescription}
                    onChange={handleFieldChange('taskDescription')}
                    className={`${inputCls} resize-y`}
                  />
                  {formErrors.taskDescription && (
                    <p className="mt-1 text-[11px] text-rose-500">{formErrors.taskDescription}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="supervisorName"
                    className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]"
                  >
                    Supervisor name
                  </label>
                  <input
                    id="supervisorName"
                    name="supervisorName"
                    type="text"
                    placeholder="e.g. Ms. Garcia"
                    value={form.supervisorName}
                    onChange={handleFieldChange('supervisorName')}
                    className={inputCls}
                  />
                  {formErrors.supervisorName && (
                    <p className="mt-1 text-[11px] text-rose-500">{formErrors.supervisorName}</p>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    type="submit"
                    className="rounded-md bg-[var(--accent)] px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
                  >
                    {editingId ? 'Save changes' : 'Add entry'}
                  </button>
                  <button
                    type="button"
                    onClick={clearForm}
                    className="rounded-md border border-[var(--border)] bg-[var(--panel)] px-4 py-2 text-xs font-semibold text-[var(--text)] transition hover:border-[var(--accent)]/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
                  >
                    {editingId ? 'Cancel edit' : 'Reset'}
                  </button>
                </div>
              </form>
            </article>

            {/* ── Log table panel ── */}
            <article className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
                    Recent logs
                  </p>
                  <h2 className="mt-1 text-base font-semibold">Your entry history</h2>
                </div>
                <span className="rounded-full bg-[var(--panel)] px-2.5 py-0.5 text-[10px] font-medium text-[var(--muted)]">
                  Newest first
                </span>
              </div>

              {orderedLogs.length === 0 ? (
                <div className="rounded-md border border-dashed border-[var(--border)] bg-[var(--panel)]/40 px-6 py-8 text-center">
                  <p className="text-sm font-semibold">No logs yet</p>
                  <p className="mt-1 text-xs text-[var(--muted)]">
                    Add your first entry to start tracking your OJT progress.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-[var(--border)] text-[10px] uppercase tracking-[0.12em] text-[var(--muted)]">
                        <th className="pb-2.5 pr-4 font-semibold">Date</th>
                        <th className="pb-2.5 pr-4 font-semibold">Hours</th>
                        <th className="pb-2.5 pr-4 font-semibold">Task</th>
                        <th className="pb-2.5 pr-4 font-semibold">Supervisor</th>
                        <th className="pb-2.5 text-right font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border)]">
                      {orderedLogs.map((entry) => (
                        <tr
                          key={entry.id}
                          className="group transition-colors hover:bg-[var(--panel)]/50"
                        >
                          <td className="whitespace-nowrap py-2.5 pr-4 text-xs text-[var(--muted)]">
                            {formatDateLabel(entry.date)}
                          </td>
                          <td
                            className="whitespace-nowrap py-2.5 pr-4 text-xs font-medium tabular-nums text-[var(--text)]"
                            style={{ fontFamily: '"DM Mono", monospace' }}
                          >
                            {formatHours(entry.hoursRendered)}h
                          </td>
                          <td className="max-w-[18rem] py-2.5 pr-4 text-xs leading-relaxed text-[var(--text)]">
                            {entry.taskDescription}
                          </td>
                          <td className="whitespace-nowrap py-2.5 pr-4 text-xs text-[var(--text)]">
                            {entry.supervisorName}
                          </td>
                          <td className="py-2.5">
                            <div className="flex justify-end gap-1.5 opacity-50 transition-opacity group-hover:opacity-100">
                              <button
                                type="button"
                                onClick={() => startEditing(entry)}
                                className="rounded border border-[var(--border)] bg-[var(--panel)] px-2.5 py-1 text-[11px] font-semibold text-[var(--text)] transition hover:border-[var(--accent)]/50 hover:text-[var(--accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => deleteEntry(entry.id)}
                                className="rounded border border-rose-400/40 bg-rose-500/10 px-2.5 py-1 text-[11px] font-semibold text-rose-500 transition hover:bg-rose-500/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </article>

          </section>
        </main>
      </div>
    </div>
  )
}

export default DashboardPage