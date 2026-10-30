import { PropsWithChildren, useCallback, useMemo, useState } from 'react'

import i18n from './config'
import { I18nContext, I18nContextType } from './i18n.context'

export const I18nProvider = ({ children }: PropsWithChildren) => {
  const [locale, setLocaleState] = useState(i18n.locale)

  const setLocale = useCallback((newLocale: string) => {
    i18n.locale = newLocale
    setLocaleState(newLocale)
  }, [])

  const value: I18nContextType = useMemo(
    () => ({
      locale,
      setLocale,
      t: i18n.t.bind(i18n)
    }),
    [locale, setLocale]
  )

  return (
    <I18nContext.Provider
      value={value}
    >
      {children}
    </I18nContext.Provider>
  )
}
