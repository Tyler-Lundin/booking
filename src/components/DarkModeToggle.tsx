'use client'
import { useEffect, useState } from 'react'

export default function DarkModeToggle() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const classList = document.documentElement.classList
    const stored = localStorage.getItem('theme')
    const shouldUseDark = stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches)

    if (shouldUseDark) {
      classList.add('dark')
      setIsDark(true)
    } else {
      classList.remove('dark')
    }
  }, [])

  const toggleTheme = () => {
    const classList = document.documentElement.classList
    if (classList.contains('dark')) {
      classList.remove('dark')
      localStorage.setItem('theme', 'light')
      setIsDark(false)
    } else {
      classList.add('dark')
      localStorage.setItem('theme', 'dark')
      setIsDark(true)
    }
  }

  return (
    <button onClick={toggleTheme} className="px-4 py-2 bg-gray-300 absolute right-0 dark:bg-gray-700 text-black dark:text-white">
      {isDark ? 'Switch to Light' : 'Switch to Dark'}
    </button>
  )
}
