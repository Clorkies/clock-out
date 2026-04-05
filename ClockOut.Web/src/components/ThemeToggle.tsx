import { useEffect, useRef, useState } from 'react'
import type { ThemeMode, ResolvedTheme } from '../hooks/useTheme'

type ThemeToggleProps = {
  theme: ThemeMode
  resolvedTheme: ResolvedTheme
  setTheme: (theme: ThemeMode) => void
}

const modes: ThemeMode[] = ['system', 'light', 'dark']

function ThemeToggle({ theme, resolvedTheme, setTheme }: ThemeToggleProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  const label = resolvedTheme === 'dark' ? 'Dark' : 'Light'

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen((previous) => !previous)}
        className="grid h-8 w-8 place-items-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] transition hover:border-[var(--accent-soft)] hover:text-[var(--text)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label={`Theme menu, current ${label}`}
      >
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="4.6" />
          <path d="M12 2.7v2.1M12 19.2v2.1M2.7 12h2.1M19.2 12h2.1M5.4 5.4l1.5 1.5M17.1 17.1l1.5 1.5M18.6 5.4l-1.5 1.5M6.9 17.1l-1.5 1.5" />
        </svg>
      </button>

      {isOpen ? (
        <div
          role="menu"
          aria-label="Theme selection menu"
          className="absolute right-0 z-20 mt-2 w-36 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-1.5 shadow-[var(--card-shadow)]"
        >
          {modes.map((mode) => {
            const isActive = theme === mode
            const title = mode.charAt(0).toUpperCase() + mode.slice(1)

            return (
              <button
                key={mode}
                type="button"
                role="menuitemradio"
                aria-checked={isActive}
                onClick={() => {
                  setTheme(mode)
                  setIsOpen(false)
                }}
                className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-xs font-semibold transition ${
                  isActive
                    ? 'bg-[var(--accent-soft)] text-[var(--accent)]'
                    : 'text-[var(--muted)] hover:bg-[var(--panel)] hover:text-[var(--text)]'
                }`}
              >
                {title}
                {isActive ? <span aria-hidden="true">On</span> : null}
              </button>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}

export default ThemeToggle
