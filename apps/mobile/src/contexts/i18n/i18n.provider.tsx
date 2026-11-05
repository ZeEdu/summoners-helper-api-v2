import { getLocales } from 'expo-localization';
import { PropsWithChildren, useCallback, useEffect, useMemo, useState } from 'react';

import Loading from '../../app/screens/feedback/Loading';
import SecureStoreService from '../../services/secure-store.service';
import i18n from './config';
import LocalePersistenceError from './errors/localePersistenceError';
import I18N_CONSTANTS from './i18n.constants';
import { I18nContext, I18nContextType, SupportedLanguages } from './i18n.context';

export const I18nProvider = ({ children }: PropsWithChildren) => {
  const [locale, setLocaleState] = useState<SupportedLanguages | null>(null)
  const [initialized, setInitialized] = useState(false)

  const setLocale = useCallback(async (newLocale: SupportedLanguages) => {
    i18n.locale = newLocale
    setLocaleState(newLocale)

    try {
      await SecureStoreService.set(I18N_CONSTANTS.STORE_KEY, newLocale)
    } catch (_) {
      throw new LocalePersistenceError()
    }
  }, [])

  useEffect(() => {
    const init = async () => {
      const savedLang = await SecureStoreService.get(I18N_CONSTANTS.STORE_KEY).catch((error) => {
        console.log('[I18nProvider]: Não foi possível carregar o locale salvo:', error);
        return undefined
      })
      const deviceLang = getLocales()[0].languageCode

      let locale: SupportedLanguages
      if (savedLang && I18N_CONSTANTS.isSupportedLanguage(savedLang)) {
        locale = savedLang
      } else if (deviceLang && I18N_CONSTANTS.isSupportedLanguage(deviceLang)) {
        locale = i18n.locale = deviceLang
      } else {
        locale = I18N_CONSTANTS.SUPPORTED_LANGUAGES.pt
      }

      i18n.locale = locale
      setLocaleState(locale)
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
