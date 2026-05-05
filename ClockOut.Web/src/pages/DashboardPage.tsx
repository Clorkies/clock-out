import { useMemo, useState, type ChangeEvent, type FormEvent } from 'react'
import { Link } from 'react-router-dom'

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
    if (a.date === b.date) {
      return b.createdAt.localeCompare(a.createdAt)
    }
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

  if (!form.date) {
    errors.date = 'Date is required.'
  }
  if (!Number.isFinite(parsedHours) || parsedHours <= 0 || parsedHours > 24) {
    errors.hoursRendered = 'Hours must be between 0.1 and 24.'
  }
  if (!form.taskDescription.trim()) {
    errors.taskDescription = 'Task description is required.'
  }
  if (form.taskDescription.trim().length > 1000) {
    errors.taskDescription = 'Task description must be 1000 characters or less.'
  }
  if (!form.supervisorName.trim()) {
    errors.supervisorName = 'Supervisor name is required.'
  }
  if (form.supervisorName.trim().length > 150) {
    errors.supervisorName = 'Supervisor name must be 150 characters or less.'
  }

  return errors
}

function DashboardPage() {
  const [logs, setLogs] = useState<LogEntry[]>(seededLogs)
  const [form, setForm] = useState<LogForm>({
    ...initialForm,
    date: getTodayDateInputValue(),
  })
  const [formErrors, setFormErrors] = useState<FormErrors>({})
  const [editingId, setEditingId] = useState<string | null>(null)

  const orderedLogs = useMemo(() => sortLogsNewestFirst(logs), [logs])
  const totalHoursLogged = useMemo(
    () => logs.reduce((total, entry) => total + entry.hoursRendered, 0),
    [logs],
  )
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
    setForm({
      ...initialForm,
      date: getTodayDateInputValue(),
    })
    setFormErrors({})
    setEditingId(null)
  }

  const handleFieldChange =
    (field: keyof LogForm) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((current) => ({ ...current, [field]: event.target.value }))
      if (formErrors[field]) {
        setFormErrors((current) => ({ ...current, [field]: undefined }))
      }
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
      setLogs((current) =>
        current.map((entry) =>
          entry.id === editingId
            ? {
                ...entry,
                ...payload,
              }
            : entry,
        ),
      )
      clearForm()
      return
    }

    const newEntry: LogEntry = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `log-${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...payload,
    }

    setLogs((current) => [newEntry, ...current])
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
    setLogs((current) => current.filter((entry) => entry.id !== id))
    if (editingId === id) {
      clearForm()
    }
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[var(--bg)] text-[var(--text)]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[10%] top-[-7rem] h-[18rem] w-[24rem] rounded-full bg-[var(--accent-glow)] blur-[120px]" />
        <div className="absolute bottom-[-8rem] right-[8%] h-[18rem] w-[24rem] rounded-full bg-[var(--accent-glow-strong)] blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-6 md:px-8 md:py-8">
        <header className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]/92 p-4 shadow-[var(--card-shadow)] backdrop-blur sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Link to="/" className="flex items-center gap-2.5 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]">
                <div className="grid h-9 w-9 place-items-center rounded-lg bg-[var(--accent)] text-[11px] font-bold text-white">
                  CO
                </div>
                <div>
                  <p className="text-sm font-semibold tracking-tight">ClockOut</p>
                  <p className="text-xs text-[var(--muted)]">Dashboard</p>
                </div>
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <p className="rounded-full border border-[var(--border)] bg-[var(--panel)] px-3 py-1 text-xs font-medium text-[var(--muted)]">
                {pageDateLabel}
              </p>
              <button
                type="button"
                onClick={() =>
                  document.getElementById('log-form')?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                  })
                }
                className="rounded-lg border border-[var(--accent)] bg-[var(--accent)] px-3 py-1.5 text-xs font-semibold text-white transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
              >
                Add log
              </button>
            </div>
          </div>
        </header>

        <main className="mt-4 space-y-4">
          <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <article className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--card-shadow)]">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">Total hours</p>
              <p className="mt-2 text-3xl font-bold tabular-nums">{formatHours(totalHoursLogged)}h</p>
            </article>

            <article className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--card-shadow)]">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">Remaining</p>
              <p className="mt-2 text-3xl font-bold tabular-nums">{formatHours(remainingHours)}h</p>
            </article>

            <article className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--card-shadow)]">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">Completion</p>
              <p className="mt-2 text-3xl font-bold tabular-nums">{percentCompleteRaw.toFixed(1)}%</p>
            </article>

            <article className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--card-shadow)]">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">Entries</p>
              <p className="mt-2 text-3xl font-bold tabular-nums">{logs.length}</p>
            </article>
          </section>

          <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--card-shadow)] sm:p-5">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">Progress to 300 hours</p>
                <p className="mt-1 text-sm text-[var(--muted)]">Keep adding complete daily logs to reach your OJT target faster.</p>
              </div>
              <p className="text-sm font-semibold tabular-nums text-[var(--text)]">{percentCompleteRaw.toFixed(1)}%</p>
            </div>

            <div className="mt-3 h-2.5 rounded-full bg-[var(--track)]">
              <div
                className="h-full rounded-full bg-[var(--accent)] transition-all duration-300"
                style={{ width: `${percentComplete}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-[var(--muted)]">
              {formatHours(totalHoursLogged)}h logged out of {REQUIRED_HOURS}h required.
            </p>
          </section>

          <section className="grid gap-4 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.35fr)]">
            <article id="log-form" className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--card-shadow)] sm:p-5">
              <div className="mb-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
                  {editingId ? 'Edit log entry' : 'Quick log entry'}
                </p>
                <h2 className="mt-1 text-lg font-semibold">
                  {editingId ? 'Update your entry' : 'Add today’s work log'}
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label htmlFor="date" className="mb-1 block text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                      Date
                    </label>
                    <input
                      id="date"
                      name="date"
                      type="date"
                      value={form.date}
                      onChange={handleFieldChange('date')}
                      className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/25"
                    />
                    {formErrors.date ? <p className="mt-1 text-xs text-rose-500">{formErrors.date}</p> : null}
                  </div>

                  <div>
                    <label htmlFor="hoursRendered" className="mb-1 block text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
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
                      className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/25"
                    />
                    {formErrors.hoursRendered ? <p className="mt-1 text-xs text-rose-500">{formErrors.hoursRendered}</p> : null}
                  </div>
                </div>

                <div>
                  <label htmlFor="taskDescription" className="mb-1 block text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                    Task description
                  </label>
                  <textarea
                    id="taskDescription"
                    name="taskDescription"
                    rows={4}
                    placeholder="What did you work on today?"
                    value={form.taskDescription}
                    onChange={handleFieldChange('taskDescription')}
                    className="w-full resize-y rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/25"
                  />
                  {formErrors.taskDescription ? <p className="mt-1 text-xs text-rose-500">{formErrors.taskDescription}</p> : null}
                </div>

                <div>
                  <label htmlFor="supervisorName" className="mb-1 block text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                    Supervisor name
                  </label>
                  <input
                    id="supervisorName"
                    name="supervisorName"
                    type="text"
                    placeholder="e.g. Ms. Garcia"
                    value={form.supervisorName}
                    onChange={handleFieldChange('supervisorName')}
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/25"
                  />
                  {formErrors.supervisorName ? <p className="mt-1 text-xs text-rose-500">{formErrors.supervisorName}</p> : null}
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    type="submit"
                    className="rounded-xl border border-[var(--accent)] bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
                  >
                    {editingId ? 'Save changes' : 'Add entry'}
                  </button>
                  <button
                    type="button"
                    onClick={clearForm}
                    className="rounded-xl border border-[var(--border)] bg-[var(--panel)] px-4 py-2 text-sm font-semibold text-[var(--text)] transition hover:border-[var(--accent)]/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
                  >
                    {editingId ? 'Cancel edit' : 'Reset'}
                  </button>
                </div>
              </form>
            </article>

            <article className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--card-shadow)] sm:p-5">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">Recent logs</p>
                  <h2 className="mt-1 text-lg font-semibold">Your entry history</h2>
                </div>
                <p className="text-xs text-[var(--muted)]">Newest first</p>
              </div>

              {orderedLogs.length === 0 ? (
                <div className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--panel)]/50 p-6 text-center">
                  <p className="text-sm font-semibold">No logs yet</p>
                  <p className="mt-1 text-sm text-[var(--muted)]">
                    Add your first entry to start tracking your OJT progress.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full border-separate border-spacing-y-2 text-left text-sm">
                    <thead>
                      <tr className="text-xs uppercase tracking-[0.12em] text-[var(--muted)]">
                        <th className="px-2 py-1 font-semibold">Date</th>
                        <th className="px-2 py-1 font-semibold">Hours</th>
                        <th className="px-2 py-1 font-semibold">Task</th>
                        <th className="px-2 py-1 font-semibold">Supervisor</th>
                        <th className="px-2 py-1 text-right font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderedLogs.map((entry) => (
                        <tr key={entry.id} className="rounded-xl border border-[var(--border)] bg-[var(--panel)]/70">
                          <td className="rounded-l-xl px-2 py-2.5 text-[var(--text)]">{formatDateLabel(entry.date)}</td>
                          <td className="px-2 py-2.5 tabular-nums text-[var(--text)]">{formatHours(entry.hoursRendered)}h</td>
                          <td className="max-w-[20rem] px-2 py-2.5 text-[var(--text)]">{entry.taskDescription}</td>
                          <td className="px-2 py-2.5 text-[var(--text)]">{entry.supervisorName}</td>
                          <td className="rounded-r-xl px-2 py-2.5">
                            <div className="flex justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => startEditing(entry)}
                                className="rounded-md border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1 text-xs font-semibold text-[var(--text)] transition hover:border-[var(--accent)]/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => deleteEntry(entry.id)}
                                className="rounded-md border border-rose-300/80 bg-rose-500/10 px-2.5 py-1 text-xs font-semibold text-rose-600 transition hover:bg-rose-500/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500"
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
