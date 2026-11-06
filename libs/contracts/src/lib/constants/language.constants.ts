export type SupportedLanguages = 'pt' | 'en'

export const SUPPORTED_LANGUAGES: Record<SupportedLanguages, SupportedLanguages> = {
  pt: 'pt',
  en: 'en'
} as const

export function isSupportedLanguage(lang: string): lang is SupportedLanguages {
  return !!SUPPORTED_LANGUAGES[lang as SupportedLanguages]
}