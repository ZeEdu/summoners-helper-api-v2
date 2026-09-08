import { useContext } from "react"
import { ItemSelectionContext, ItemSelectionContextProps } from "./item-selection.provider"

export const useItemSelectionContext = () => {
  const context = useContext(ItemSelectionContext)

  if (context === undefined) {
    throw new Error(
      'ItemSelectionContext deve ser utilizado dentro de ItemSelectionProvider'
    )
  }

  return context as ItemSelectionContextProps
}