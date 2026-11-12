import { SupportedLanguages } from "./i18n.context"

const SUPPORTED_LANGUAGES: Record<SupportedLanguages, SupportedLanguages> = {
  pt: 'pt',
  en: 'en'
} as const

const SUPPORTED_LANGUAGES_LABELS: Record<SupportedLanguages, string> = {
  pt: 'Português',
  en: 'English'
} as const

function isSupportedLanguage(lang: string): lang is SupportedLanguages {
  return !!SUPPORTED_LANGUAGES[lang as SupportedLanguages]
}

const STORE_KEY = 'lang' as const

const I18N_CONSTANTS = {
  isSupportedLanguage,
  SUPPORTED_LANGUAGES,
  SUPPORTED_LANGUAGES_LABELS,
  STORE_KEY
}

export default I18N_CONSTANTS