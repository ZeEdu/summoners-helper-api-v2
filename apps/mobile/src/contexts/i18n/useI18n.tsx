import { useContext } from "react"
import { I18nContext } from "./i18n.context"

export default function useI18n() {
  const context = useContext(I18nContext)
  if (context === undefined) {
    throw new Error('useInternationalization deve ser utilizado dentro de InternationalizationProvider')
  }
  return context
}