import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { AcceptLanguageResolver, HeaderResolver } from "nestjs-i18n";

export type SupportedLanguages = 'pt' | 'en'

const SUPPORTED_LANGUAGES: Record<SupportedLanguages, SupportedLanguages> = {
  pt: 'pt',
  en: 'en'
} as const

function isSupportedLanguage(lang: string): lang is SupportedLanguages {
  return !!SUPPORTED_LANGUAGES[lang as SupportedLanguages]
}


export const GetLang = createParamDecorator(async (data: unknown, ctx: ExecutionContext) => {
  const headerResolver = new HeaderResolver(['x-lang'])
  const languageFromHeader = await headerResolver.resolve(ctx)
  const acceptLanguageResolver = new AcceptLanguageResolver()
  const languageFromAcceptLanguage = await acceptLanguageResolver.resolve(ctx)

  const resolvedLanguage = languageFromHeader || languageFromAcceptLanguage

  if (resolvedLanguage === undefined) {
    return SUPPORTED_LANGUAGES.pt
  }

  if (Array.isArray(resolvedLanguage)) {
    if (isSupportedLanguage(resolvedLanguage[0])) {
      return resolvedLanguage[0]
    }
    return SUPPORTED_LANGUAGES.pt
  }

  if (isSupportedLanguage(resolvedLanguage)) {
    return resolvedLanguage
  }

  return SUPPORTED_LANGUAGES.pt
})