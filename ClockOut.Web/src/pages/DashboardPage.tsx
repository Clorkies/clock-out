import { useMemo, useRef, useState, useEffect, type ChangeEvent, type FormEvent } from 'react'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import ThemeToggle from '../components/ThemeToggle'
import type { ThemeMode, ResolvedTheme } from '../hooks/useTheme'

// ─── Font injection ───────────────────────────────────────────────────────────
if (!document.getElementById('dashboard-fonts')) {
  const link = document.createElement('link')
  link.id = 'dashboard-fonts'
  link.rel = 'stylesheet'
  link.href =
    'https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=DM+Mono:wght@400;500&display=swap'
  document.head.appendChild(link)
}

const REQUIRED_HOURS = 300
const TASK_PREVIEW_CHAR_LIMIT = 120

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
type DashboardPageProps = {
  theme: ThemeMode
  resolvedTheme: ResolvedTheme
  setTheme: (theme: ThemeMode) => void
}
type DashboardUserIdentity = {
  firstName: string
  lastName: string
  email: string
}

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

function getUserIdentityFromStorage(): DashboardUserIdentity {
  const fallback: DashboardUserIdentity = {
    firstName: 'Guest',
    lastName: 'User',
    email: 'Not provided',
  }

  if (typeof window === 'undefined') return fallback

  const candidateKeys = ['clockout_user', 'clockoutUser', 'authUser', 'user', 'profile']

  for (const key of candidateKeys) {
    const raw = window.localStorage.getItem(key)
    if (!raw) continue

    try {
      const parsed = JSON.parse(raw) as Record<string, unknown>
      const source =
        typeof parsed.user === 'object' && parsed.user !== null
          ? (parsed.user as Record<string, unknown>)
          : parsed

      const firstName =
        typeof source.firstName === 'string'
          ? source.firstName
          : typeof source.firstname === 'string'
            ? source.firstname
            : ''
      const lastName =
        typeof source.lastName === 'string'
          ? source.lastName
          : typeof source.lastname === 'string'
            ? source.lastname
            : ''
      const email = typeof source.email === 'string' ? source.email : ''

      if (firstName || lastName || email) {
        return {
          firstName: firstName || fallback.firstName,
          lastName: lastName || fallback.lastName,
          email: email || fallback.email,
        }
      }
    } catch {
      continue
    }
  }

  return fallback
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
  'w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm transition ' +
  'focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 ' +
  'placeholder:text-[var(--muted)]/40'

// ─── OJT Target Modal ─────────────────────────────────────────────────────────
function OjtTargetModal({
  current,
  onSave,
  onClose,
}: {
  current: number
  onSave: (h: number) => void
  onClose: () => void
}) {
  const [val, setVal] = useState(String(current))
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute inset-x-0 top-0 h-[2px] bg-[var(--accent)]" />
        <h3 className="mb-1 text-base font-semibold">Adjust OJT Target</h3>
        <p className="mb-4 text-xs text-[var(--muted)]">Set your total required OJT hours.</p>
        <input
          type="number"
          min={1}
          max={10000}
          value={val}
          onChange={(e) => setVal(e.target.value)}
          className={inputCls}
        />
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => {
              const n = Number(val)
              if (n > 0) onSave(n)
            }}
            className="flex-1 rounded-lg bg-[var(--accent)] py-2 text-xs font-semibold text-white transition hover:brightness-110"
          >
            Save
          </button>
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-[var(--border)] py-2 text-xs font-semibold text-[var(--text)] transition hover:border-[var(--accent)]/40"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

function DashboardPage({ theme, resolvedTheme, setTheme }: DashboardPageProps) {
  const [requiredHours, setRequiredHours] = useState(REQUIRED_HOURS)
  const [logs, setLogs] = useState<LogEntry[]>(seededLogs)
  const [form, setForm] = useState<LogForm>({ ...initialForm, date: getTodayDateInputValue() })
  const [formErrors, setFormErrors] = useState<FormErrors>({})
  const [editingId, setEditingId] = useState<string | null>(null)
  const [profileOpen, setProfileOpen] = useState(false)
  const [ojtModalOpen, setOjtModalOpen] = useState(false)
  const [expandedTaskDescriptions, setExpandedTaskDescriptions] = useState<Record<string, boolean>>({})
  const profileRef = useRef<HTMLDivElement>(null)

  // Close dropdown on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const orderedLogs = useMemo(() => sortLogsNewestFirst(logs), [logs])
  const totalHoursLogged = useMemo(() => logs.reduce((t, e) => t + e.hoursRendered, 0), [logs])
  const remainingHours = Math.max(0, requiredHours - totalHoursLogged)
  const percentCompleteRaw = requiredHours > 0 ? (totalHoursLogged / requiredHours) * 100 : 0
  const percentComplete = Math.min(100, percentCompleteRaw)
  const recentHoursSeries = useMemo(() => {
    const series = orderedLogs
      .slice(0, 7)
      .reverse()
      .map((entry) => entry.hoursRendered)
    while (series.length < 7) series.unshift(0)
    return series
  }, [orderedLogs])
  const recentHoursPeak = useMemo(() => Math.max(8, ...recentHoursSeries), [recentHoursSeries])
  const userIdentity = useMemo(() => getUserIdentityFromStorage(), [])

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
    setExpandedTaskDescriptions((current) => {
      if (!current[id]) return current
      const next = { ...current }
      delete next[id]
      return next
    })
    if (editingId === id) clearForm()
  }

  const downloadDashboardReport = () => {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' })
    const pageWidth = doc.internal.pageSize.getWidth()
    const margin = 40

    const safeSetFill = (r: number, g: number, b: number) => doc.setFillColor(r, g, b)
    const safeSetText = (r: number, g: number, b: number) => doc.setTextColor(r, g, b)
    const formatDateTime = new Date().toLocaleString()

    // Title
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(20)
    safeSetText(30, 26, 45)
    doc.text('ClockOut Dashboard Report', margin, 48)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    safeSetText(100, 94, 123)
    doc.text(`Generated: ${formatDateTime}`, margin, 66)
    doc.text(`Name: ${userIdentity.firstName} ${userIdentity.lastName}`, margin, 82)
    doc.text(`Email: ${userIdentity.email}`, margin, 98)

    // Progress overview panel
    const panelY = 118
    const panelW = pageWidth - margin * 2
    const panelH = 238
    safeSetFill(240, 238, 248)
    doc.roundedRect(margin, panelY, panelW, panelH, 14, 14, 'F')

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(12)
    safeSetText(45, 39, 66)
    doc.text('Progress Overview', margin + 16, panelY + 24)

    // KPI cards
    const cardY = panelY + 38
    const cardGap = 10
    const cardW = (panelW - 32 - cardGap * 2) / 3
    const cards = [
      { label: 'Total Hours', value: `${formatHours(totalHoursLogged)}h` },
      { label: 'Remaining', value: `${formatHours(remainingHours)}h` },
      { label: 'Completion', value: `${percentCompleteRaw.toFixed(1)}%` },
    ]
    cards.forEach((card, idx) => {
      const x = margin + 16 + idx * (cardW + cardGap)
      safeSetFill(255, 255, 255)
      doc.roundedRect(x, cardY, cardW, 58, 10, 10, 'F')
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(9)
      safeSetText(110, 104, 130)
      doc.text(card.label, x + 10, cardY + 18)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(16)
      safeSetText(42, 36, 64)
      doc.text(card.value, x + 10, cardY + 40)
    })

    // Progress bar
    const progressY = cardY + 78
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    safeSetText(92, 86, 113)
    doc.text(
      `${formatHours(totalHoursLogged)}h of ${formatHours(requiredHours)}h target`,
      margin + 16,
      progressY - 8,
    )
    safeSetFill(213, 205, 234)
    doc.roundedRect(margin + 16, progressY, panelW - 32, 8, 4, 4, 'F')
    safeSetFill(109, 94, 247)
    doc.roundedRect(margin + 16, progressY, ((panelW - 32) * percentComplete) / 100, 8, 4, 4, 'F')

    // 7-day mini bar visual
    const graphY = progressY + 28
    const graphX = margin + 16
    const graphW = panelW - 32
    const graphH = 72
    const barGap = 8
    const barW = (graphW - barGap * (recentHoursSeries.length - 1)) / recentHoursSeries.length
    recentHoursSeries.forEach((hours, idx) => {
      const normalized = hours === 0 ? 0.15 : Math.max(0.15, hours / recentHoursPeak)
      const barH = graphH * normalized
      const x = graphX + idx * (barW + barGap)
      const y = graphY + (graphH - barH)
      safeSetFill(125, 104, 249)
      doc.roundedRect(x, y, barW, barH, 3, 3, 'F')
    })
    doc.setFontSize(8)
    safeSetText(120, 113, 142)
    doc.text('Recent 7 logged days', graphX, graphY + graphH + 13)

    // Insights section
    const totalEntries = logs.length
    const averageHours = totalEntries ? totalHoursLogged / totalEntries : 0
    const sortedByHours = [...logs].sort((a, b) => b.hoursRendered - a.hoursRendered)
    const topEntry = sortedByHours[0]
    const supervisorHoursMap = logs.reduce<Record<string, number>>((acc, entry) => {
      acc[entry.supervisorName] = (acc[entry.supervisorName] ?? 0) + entry.hoursRendered
      return acc
    }, {})
    const topSupervisor = Object.entries(supervisorHoursMap).sort((a, b) => b[1] - a[1])[0]

    const insightsY = panelY + panelH + 24
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(12)
    safeSetText(45, 39, 66)
    doc.text('Insights Summary', margin, insightsY)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    safeSetText(86, 80, 106)
    const insights = [
      `User: ${userIdentity.firstName} ${userIdentity.lastName} (${userIdentity.email})`,
      `Average hours per entry: ${formatHours(averageHours)}h`,
      `Highest single log: ${topEntry ? `${formatHours(topEntry.hoursRendered)}h on ${formatDateLabel(topEntry.date)}` : 'N/A'}`,
      `Top supervisor by total logged hours: ${topSupervisor ? `${topSupervisor[0]} (${formatHours(topSupervisor[1])}h)` : 'N/A'}`,
      `Current completion: ${percentCompleteRaw.toFixed(1)}% (${formatHours(remainingHours)}h remaining)`,
    ]
    insights.forEach((line, idx) => doc.text(`- ${line}`, margin, insightsY + 20 + idx * 16))
    const insightsBottomY = insightsY + 20 + (insights.length - 1) * 16

    // Logs table section
    const tableStartY = insightsBottomY + 32
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(12)
    safeSetText(45, 39, 66)
    doc.text('Detailed Entry Logs', margin, tableStartY)

    autoTable(doc, {
      startY: tableStartY + 8,
      head: [['Date', 'Hours', 'Task Description', 'Supervisor']],
      body: orderedLogs.map((entry) => [
        formatDateLabel(entry.date),
        `${formatHours(entry.hoursRendered)}h`,
        entry.taskDescription,
        entry.supervisorName,
      ]),
      theme: 'grid',
      styles: {
        fontSize: 9,
        cellPadding: 6,
        textColor: [45, 39, 66],
        lineColor: [222, 216, 239],
        lineWidth: 0.6,
      },
      headStyles: {
        fillColor: [109, 94, 247],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [248, 246, 255],
      },
      columnStyles: {
        0: { cellWidth: 86 },
        1: { cellWidth: 58, halign: 'right' },
        2: { cellWidth: 270 },
        3: { cellWidth: 100 },
      },
      margin: { left: margin, right: margin },
    })

    doc.save(`clockout-dashboard-report-${new Date().toISOString().slice(0, 10)}.pdf`)
  }

  return (
    <div
      className="relative min-h-screen overflow-x-hidden bg-[var(--bg)] text-[var(--text)] pb-20"
      style={{ fontFamily: '"DM Sans", system-ui, sans-serif' }}
    >
      {/* ── Single subtle ambient glow at bottom center ── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          className="absolute bottom-[-10rem] left-1/2 h-[30rem] w-[50rem] -translate-x-1/2 rounded-full opacity-30 blur-[160px]"
          style={{ background: 'var(--accent-glow)' }}
        />
      </div>

      {ojtModalOpen && (
        <OjtTargetModal
          current={requiredHours}
          onSave={(h) => { setRequiredHours(h); setOjtModalOpen(false) }}
          onClose={() => setOjtModalOpen(false)}
        />
      )}

      <div className="relative mx-auto max-w-7xl px-4 py-8 md:px-8">

        {/* ════════════════════════════════
            HEADER — Free floating elements
        ════════════════════════════════ */}
        <header className="relative mb-10 flex items-center justify-between">
            {/* Nav Bar Pill */}
            <div className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)]/90 px-5 py-2.5 shadow-sm backdrop-blur-md">
              <img
                src="/ClockOut_Logo.png"
                alt="ClockOut logo"
                className="h-8 w-8 rounded-lg object-cover shadow-sm"
              />
              <p className="text-sm font-bold tracking-tight">ClockOut</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={downloadDashboardReport}
                className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)]/95 px-3.5 py-2 text-xs font-semibold text-[var(--text)] shadow-sm transition hover:border-[var(--accent)]/45 hover:bg-[var(--panel)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Download PDF
              </button>

              <div className="h-6 w-px bg-[var(--border)]/85" aria-hidden="true" />

              <div className="flex items-center gap-2">
                <ThemeToggle
                  theme={theme}
                  resolvedTheme={resolvedTheme}
                  setTheme={setTheme}
                />

                {/* User profile dropdown */}
                <div className="relative z-50" ref={profileRef}>
                  <button
                    type="button"
                    onClick={() => setProfileOpen((p) => !p)}
                    className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs font-semibold text-[var(--text)] transition hover:bg-[var(--panel)] shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
                    aria-haspopup="menu"
                    aria-expanded={profileOpen}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    <span>Profile</span>
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 top-full mt-3 w-56 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl backdrop-blur-md">
                      <div className="border-b border-[var(--border)] px-4 py-3 bg-[var(--panel)]/30">
                        <p className="text-xs font-semibold">User Profile</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => { setOjtModalOpen(true); setProfileOpen(false) }}
                        className="flex w-full items-center gap-3 px-4 py-3 text-xs font-medium text-[var(--text)] transition hover:bg-[var(--panel)]"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/></svg>
                        Adjust OJT Target Hour
                      </button>
                      <button
                        type="button"
                        onClick={() => { setProfileOpen(false); /* Handle logout logic here */ }}
                        className="flex w-full items-center gap-3 px-4 py-3 text-xs font-medium text-rose-500 transition hover:bg-rose-500/10"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
        </header>

        <main className="space-y-6">

          {/* ════════════════════════════════
              UNIFIED STATS PANEL
          ════════════════════════════════ */}
          <section className="overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm md:p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                  Progress overview
                </p>
                <h2 className="mt-1 text-base font-semibold">OJT tracker snapshot</h2>
              </div>
            </div>

            <div className="grid gap-4 xl:grid-cols-12">
              <div className="space-y-4 xl:col-span-8">
                <div className="grid gap-3 sm:grid-cols-3">
                  <article className="rounded-2xl border border-[var(--border)] bg-[var(--panel)]/45 p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                      Total hours
                    </p>
                    <p
                      className="mt-2 text-3xl font-bold tabular-nums leading-none"
                      style={{ fontFamily: '"DM Mono", monospace' }}
                    >
                      {formatHours(totalHoursLogged)}
                      <span className="ml-1 text-base font-medium text-[var(--muted)]">h</span>
                    </p>
                  </article>
                  <article className="rounded-2xl border border-[var(--border)] bg-[var(--panel)]/45 p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                      Remaining
                    </p>
                    <p
                      className="mt-2 text-3xl font-bold tabular-nums leading-none"
                      style={{ fontFamily: '"DM Mono", monospace' }}
                    >
                      {formatHours(remainingHours)}
                      <span className="ml-1 text-base font-medium text-[var(--muted)]">h</span>
                    </p>
                  </article>
                  <article className="rounded-2xl border border-[var(--border)] bg-[var(--panel)]/45 p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                      Completion
                    </p>
                    <p
                      className="mt-2 text-3xl font-bold tabular-nums leading-none"
                      style={{ fontFamily: '"DM Mono", monospace' }}
                    >
                      {percentCompleteRaw.toFixed(1)}
                      <span className="ml-1 text-base font-medium text-[var(--muted)]">%</span>
                    </p>
                  </article>
                </div>

                <article className="rounded-2xl border border-[var(--border)] bg-[var(--panel)]/35 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-xs font-semibold text-[var(--text)]">
                      {formatHours(totalHoursLogged)}h of {formatHours(requiredHours)}h target
                    </p>
                    <p className="text-[11px] font-medium text-[var(--muted)]">Last 7 logged days</p>
                  </div>
                  <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-[var(--track)]">
                    <div
                      className="h-full rounded-full bg-[var(--accent)] transition-all duration-500"
                      style={{ width: `${percentComplete}%` }}
                    />
                  </div>
                  <div className="mt-4 flex items-end gap-2">
                    {recentHoursSeries.map((hours, idx) => (
                      <div key={`hour-bar-${idx}`} className="flex min-w-0 flex-1 flex-col items-center gap-1">
                        <div className="flex h-20 w-full items-end">
                          <div
                            className="w-full rounded-md bg-[var(--accent)]/75 transition-all"
                            style={{
                              height: `${hours === 0 ? 12 : Math.max(12, (hours / recentHoursPeak) * 100)}%`,
                            }}
                          />
                        </div>
                        <span className="text-[10px] text-[var(--muted)]">{hours === 0 ? '-' : formatHours(hours)}</span>
                      </div>
                    ))}
                  </div>
                </article>
              </div>

              <article className="rounded-2xl border border-[var(--border)] bg-[var(--panel)]/40 p-4 xl:col-span-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                  Completion ring
                </p>
                <div className="mt-3 flex flex-col items-center gap-4 rounded-xl border border-[var(--border)] bg-[var(--surface)]/75 p-4">
                  <div
                    className="grid h-28 w-28 place-items-center rounded-full"
                    style={{
                      background: `conic-gradient(var(--accent) ${percentComplete}%, var(--track) ${percentComplete}% 100%)`,
                    }}
                  >
                    <div className="grid h-20 w-20 place-items-center rounded-full bg-[var(--surface)] text-sm font-semibold tabular-nums">
                      {percentCompleteRaw.toFixed(0)}%
                    </div>
                  </div>
                  <div className="grid w-full grid-cols-3 gap-2 border-t border-[var(--border)] pt-3 text-center text-[11px]">
                    <div>
                      <p className="text-[var(--muted)]">Target</p>
                      <p className="mt-1 font-semibold text-[var(--text)] tabular-nums">{formatHours(requiredHours)}h</p>
                    </div>
                    <div>
                      <p className="text-[var(--muted)]">Logged</p>
                      <p className="mt-1 font-semibold text-[var(--text)] tabular-nums">{formatHours(totalHoursLogged)}h</p>
                    </div>
                    <div>
                      <p className="text-[var(--muted)]">Left</p>
                      <p className="mt-1 font-semibold text-[var(--text)] tabular-nums">{formatHours(remainingHours)}h</p>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          </section>

          {/* ════════════════════════════════
              FORM + TABLE — Adjusted heights to prevent empty space
          ════════════════════════════════ */}
          <section className="grid gap-6 lg:grid-cols-12 items-start">

            {/* ── Log Entry Form (h-fit ensures it doesn't stretch down) ── */}
            <article
              id="log-form"
              className="lg:col-span-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-sm h-fit"
            >
              <div className="p-6">
                <div className="mb-5">
                  <h2 className="text-lg font-semibold tracking-tight">
                    {editingId ? 'Edit Log Entry' : 'Log Entry'}
                  </h2>
                  <p className="text-xs text-[var(--muted)] mt-1">
                    {editingId ? 'Update your current selection.' : 'Record your daily tasks.'}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="date"
                        className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]"
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
                        className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]"
                      >
                        Hours
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
                      className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]"
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
                      className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]"
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

                  <div className="flex flex-wrap items-center gap-2 pt-2">
                    <button
                      type="submit"
                      className="w-full sm:w-auto rounded-lg bg-[var(--accent)] px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
                    >
                      {editingId ? 'Save changes' : 'Add entry'}
                    </button>
                    <button
                      type="button"
                      onClick={clearForm}
                      className="w-full sm:w-auto rounded-lg border border-[var(--border)] bg-[var(--panel)] px-5 py-2.5 text-xs font-semibold text-[var(--text)] transition hover:border-[var(--accent)]/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
                    >
                      {editingId ? 'Cancel edit' : 'Reset'}
                    </button>
                  </div>
                </form>
              </div>
            </article>

            {/* ── Log table panel (h-fit & bounded overflow for independent scrolling) ── */}
            <article className="lg:col-span-8 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-sm h-fit">
              <div className="border-b border-[var(--border)] px-6 py-5 bg-[var(--surface)] z-20 relative">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h2 className="text-lg font-semibold tracking-tight">Recent Logs</h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-[var(--panel)] border border-[var(--border)] px-3 py-1 text-[10px] font-semibold tracking-wide text-[var(--muted)] uppercase">
                      {logs.length} {logs.length === 1 ? 'entry' : 'entries'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Setting max height prevents the container from stretching infinitely downward */}
              <div className="max-h-[500px] overflow-y-auto">
                {orderedLogs.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--panel)]/40 mx-6 my-6 px-6 py-10 text-center">
                    <p className="text-sm font-semibold">No logs yet</p>
                    <p className="mt-1 text-xs text-[var(--muted)]">
                      Add your first entry to start tracking your OJT progress.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm">
                      <thead className="sticky top-0 z-10 bg-[var(--surface)]/95 backdrop-blur-sm">
                        <tr className="border-b border-[var(--border)] text-[10px] uppercase tracking-[0.12em] text-[var(--muted)]">
                          <th className="px-6 pb-3 pt-4 font-semibold">Date</th>
                          <th className="pb-3 pr-4 pt-4 font-semibold">Hours</th>
                          <th className="pb-3 pr-4 pt-4 font-semibold">Task</th>
                          <th className="pb-3 pr-4 pt-4 font-semibold">Supervisor</th>
                          <th className="pb-3 pr-6 pt-4 text-right font-semibold">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--border)]">
                        {orderedLogs.map((entry) => {
                          const isTaskExpanded = Boolean(expandedTaskDescriptions[entry.id])
                          const taskText = entry.taskDescription.trim()
                          const canExpandTask = taskText.length > TASK_PREVIEW_CHAR_LIMIT
                          const taskPreview = canExpandTask
                            ? `${taskText.slice(0, TASK_PREVIEW_CHAR_LIMIT).trimEnd()}...`
                            : taskText

                          return (
                          <tr
                            key={entry.id}
                            className={`group transition-colors hover:bg-[var(--panel)]/50 ${isTaskExpanded ? 'h-auto' : 'h-[84px]'}`}
                          >
                            <td className="whitespace-nowrap py-3.5 pl-6 pr-4 text-xs text-[var(--muted)]">
                              {formatDateLabel(entry.date)}
                            </td>
                            <td
                              className="whitespace-nowrap py-3.5 pr-4 text-xs font-medium tabular-nums text-[var(--text)]"
                              style={{ fontFamily: '"DM Mono", monospace' }}
                            >
                              {formatHours(entry.hoursRendered)}h
                            </td>
                            <td className="max-w-[16rem] py-3.5 pr-4 align-top text-xs leading-relaxed text-[var(--text)]">
                              <p className="break-words">
                                {isTaskExpanded ? taskText : taskPreview}
                              </p>
                              {canExpandTask && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    setExpandedTaskDescriptions((current) => ({
                                      ...current,
                                      [entry.id]: !current[entry.id],
                                    }))
                                  }
                                  className="mt-1 inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--accent)] hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
                                >
                                  <span>{isTaskExpanded ? 'Show less' : 'Show more'}</span>
                                  <span aria-hidden="true">{isTaskExpanded ? '▲' : '▼'}</span>
                                </button>
                              )}
                            </td>
                            <td className="whitespace-nowrap py-3.5 pr-4 text-xs text-[var(--text)]">
                              {entry.supervisorName}
                            </td>
                            <td className="py-3.5 pr-6">
                              <div className="flex justify-end gap-2 opacity-50 transition-opacity group-hover:opacity-100">
                                <button
                                  type="button"
                                  onClick={() => startEditing(entry)}
                                  className="rounded-lg border border-[var(--border)] bg-[var(--panel)] px-3 py-1.5 text-[11px] font-semibold text-[var(--text)] transition hover:border-[var(--accent)]/50 hover:text-[var(--accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
                                >
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  onClick={() => deleteEntry(entry.id)}
                                  className="rounded-lg border border-rose-400/40 bg-rose-500/10 px-3 py-1.5 text-[11px] font-semibold text-rose-500 transition hover:bg-rose-500/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        )})}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </article>

          </section>
        </main>
      </div>
    </div>
  )
}

export default DashboardPage