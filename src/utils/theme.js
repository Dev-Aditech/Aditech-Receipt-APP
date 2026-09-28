// Light / dark mode. The choice is remembered in the browser.
import { useState } from 'react'

const KEY = 'receiptdesk:theme'

function readTheme() {
  try {
    return localStorage.getItem(KEY) === 'light' ? 'light' : 'dark' // dark by default
  } catch {
    return 'dark'
  }
}

function applyTheme(theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark')
}

// Call once when the app starts, so the page does not flash the wrong colour
export function initTheme() {
  applyTheme(readTheme())
}

// Used by the sun/moon button:  const [theme, toggleTheme] = useTheme()
export function useTheme() {
  const [theme, setTheme] = useState(readTheme)

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    applyTheme(next)
    try {
      localStorage.setItem(KEY, next)
    } catch {
      /* ignore: private browsing can block storage */
    }
  }

  return [theme, toggleTheme]
}