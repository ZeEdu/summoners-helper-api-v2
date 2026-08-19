import { createContext, PropsWithChildren, useContext, useState } from "react"

type ItemSelectionContextProps = {
  fieldName: string,
  setFieldName: React.Dispatch<React.SetStateAction<string>>,
  showItemSearcher: boolean,
  setShowItemSearcher: React.Dispatch<React.SetStateAction<boolean>>,
  appendFunction: (args: any) => undefined,
  // setAppendFunction: React.Dispatch<React.SetStateAction<() => undefined>>
  setAppendFunction: any
}

export const ItemSelectionContext = createContext<ItemSelectionContextProps | undefined>(undefined)

export const useItemSelectionContext = () => {
  const context = useContext(ItemSelectionContext)

  if (context === undefined) {
    throw new Error(
      'ItemSelectionContext deve ser utilizado dentro de ItemSelectionProvider'
    )
  }

  return context as ItemSelectionContextProps
}

export function ItemSelectionProvider({ children }: PropsWithChildren) {
  const [fieldName, setFieldName] = useState('')
  const [showItemSearcher, setShowItemSearcher] = useState(false)

  const [appendFunction, setAppendFunction] = useState<any>(() => () => undefined)

  const contextValue: ItemSelectionContextProps = {
    fieldName,
    setFieldName,
    showItemSearcher,
    setShowItemSearcher,
    appendFunction,
    setAppendFunction
  }

  return (
    <ItemSelectionContext.Provider value={contextValue}>
      {children}
    </ItemSelectionContext.Provider>
  )
}