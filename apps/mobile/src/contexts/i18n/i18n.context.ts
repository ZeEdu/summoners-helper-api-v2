import { Scope, TranslateOptions } from "i18n-js";
import { createContext } from "react";

export type I18nContextType = {
  locale: string,
  setLocale: (locale: string) => void,
  t: <T = string>(scope: Scope, options?: TranslateOptions | undefined) => string | T,
}

export const I18nContext = createContext<I18nContextType | undefined>(undefined)