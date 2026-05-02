'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { translations, type Locale, type T } from './translations'

type LocaleContextType = {
  locale: Locale
  t: T
  setLocale: (l: Locale) => void
}

const LocaleContext = createContext<LocaleContextType>({
  locale: 'en',
  t: translations.en,
  setLocale: () => {},
})

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en')

  useEffect(() => {
    const saved = localStorage.getItem('locale') as Locale | null
    if (saved === 'en' || saved === 'es') setLocaleState(saved)
  }, [])

  function setLocale(l: Locale) {
    setLocaleState(l)
    localStorage.setItem('locale', l)
  }

  return (
    <LocaleContext.Provider value={{ locale, t: translations[locale], setLocale }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  return useContext(LocaleContext)
}
