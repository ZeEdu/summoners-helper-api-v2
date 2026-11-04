import { getLocales } from 'expo-localization';
import { PropsWithChildren, useCallback, useEffect, useMemo, useState } from 'react';

import Loading from '../../app/screens/feedback/Loading';
import SecureStoreService from '../../services/secure-store.service';
import i18n from './config';
import I18N_CONSTANTS from './i18n.constants';
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
      try {
        const savedLang = await SecureStoreService.get('lang')
        const deviceLang = getLocales()[0].languageCode

        if (savedLang && I18N_CONSTANTS.isLanguageSupported(savedLang)) {
          i18n.locale = savedLang
        } else if (deviceLang && I18N_CONSTANTS.isLanguageSupported(deviceLang)) {
          i18n.locale = deviceLang
        } else {
          i18n.locale = 'pt'
        }
        setLocaleState(i18n.locale)

      } catch (error) {
        console.log('[I18nProvider]: Failed to initialize i18n: ', error);
        i18n.locale = 'pt'
        setLocaleState(i18n.locale)
      } finally {
        setInitialized(true)
      }
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
