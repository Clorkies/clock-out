import type { ThemeMode, ResolvedTheme } from '../hooks/useTheme'

type ThemeToggleProps = {
  theme: ThemeMode
  resolvedTheme: ResolvedTheme
  setTheme: (theme: ThemeMode) => void
  toggleTheme: () => void
}

const baseButtonClass =
  'rounded-full border px-3 py-1.5 text-xs font-semibold tracking-wide transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]'

const inactiveButtonClass =
  'border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] hover:border-[var(--accent-soft)] hover:text-[var(--text)]'

const activeButtonClass =
  'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--text)]'

function ThemeToggle({
  theme,
  resolvedTheme,
  setTheme,
  toggleTheme,
}: ThemeToggleProps) {
  const modeLabel = resolvedTheme === 'dark' ? 'Dark' : 'Light'

  return (
    <div className="flex items-center gap-2">
      <div
        className="flex items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--surface)]/90 p-1 shadow-[var(--card-shadow)] backdrop-blur"
        role="group"
        aria-label="Theme mode selection"
      >
        <button
          type="button"
          onClick={() => setTheme('light')}
          className={`${baseButtonClass} ${theme === 'light' ? activeButtonClass : inactiveButtonClass}`}
        >
          Light
        </button>
        <button
          type="button"
          onClick={() => setTheme('system')}
          className={`${baseButtonClass} ${theme === 'system' ? activeButtonClass : inactiveButtonClass}`}
        >
          System
        </button>
        <button
          type="button"
          onClick={() => setTheme('dark')}
          className={`${baseButtonClass} ${theme === 'dark' ? activeButtonClass : inactiveButtonClass}`}
        >
          Dark
        </button>
      </div>

      <button
        type="button"
        onClick={toggleTheme}
        className="rounded-full border border-[var(--accent)] bg-[var(--accent)] px-3 py-2 text-xs font-semibold tracking-wide text-white transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
      >
        Toggle to {modeLabel === 'Dark' ? 'Light' : 'Dark'}
      </button>
    </div>
  )
}

export default ThemeToggle
