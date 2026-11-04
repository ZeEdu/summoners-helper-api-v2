import { getLocales } from 'expo-localization';
import { PropsWithChildren, useCallback, useEffect, useMemo, useState } from 'react';

import Loading from '../../app/screens/feedback/Loading';
import SecureStoreService from '../../services/secure-store.service';
import i18n from './config';
import { I18nContext, I18nContextType } from './i18n.context';

export const I18nProvider = ({ children }: PropsWithChildren) => {
  const [locale, setLocaleState] = useState<string | null>(null)
  const [initialized, setInitialized] = useState(false)

  const setLocale = useCallback(async (newLocale: string) => {
    i18n.locale = newLocale
    setLocaleState(newLocale)
    await SecureStoreService.set('lang', newLocale)
  }, [])

  useEffect(() => {
    const init = async () => {
      const savedLang = await SecureStoreService.get('lang')
      const deviceLang = getLocales()[0].languageCode
      if (savedLang) {
        i18n.locale = savedLang
      } else {
        i18n.locale = deviceLang ?? 'pt'
      }

      setLocaleState(i18n.locale)
      setInitialized(true)
    }

    init()
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
      {initialized ? children : <Loading i18nKey={'i18n'} />}
    </I18nContext.Provider>
  )
}
