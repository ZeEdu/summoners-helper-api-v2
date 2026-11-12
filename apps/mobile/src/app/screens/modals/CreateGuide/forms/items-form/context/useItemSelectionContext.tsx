import { useContext } from "react"
import useI18n from "../../../../../../../contexts/i18n/useI18n"
import { ItemSelectionContext, ItemSelectionContextProps } from "./item-selection.provider"

export const useItemSelectionContext = () => {
  const context = useContext(ItemSelectionContext)
  const i18n = useI18n()

  if (context === undefined) {
    throw new Error(
      i18n.t('itemContext.error')
    )
  }

  return context as ItemSelectionContextProps
}