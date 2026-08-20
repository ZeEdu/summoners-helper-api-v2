import { createContext, PropsWithChildren, useState } from "react"

export type ItemSelectionContextProps = {
  fieldName: string,
  setFieldName: React.Dispatch<React.SetStateAction<string>>,
  showItemSearcher: boolean,
  setShowItemSearcher: React.Dispatch<React.SetStateAction<boolean>>,
  appendFunction: (args: any) => undefined,
  setAppendFunction: any
}

export const ItemSelectionContext = createContext<ItemSelectionContextProps | undefined>(undefined)

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