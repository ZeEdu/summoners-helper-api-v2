import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { AcceptLanguageResolver, HeaderResolver } from "nestjs-i18n";

import { isSupportedLanguage, SUPPORTED_LANGUAGES } from "@org/contracts";

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