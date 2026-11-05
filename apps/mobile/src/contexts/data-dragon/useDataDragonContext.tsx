import { useContext } from "react"
import { DataDragonContext } from "./data-dragon.context"

export default function useDataDragon() {
  const context = useContext(DataDragonContext)
  if (context === undefined) {
    throw new Error('useDataDragon deve ser utilizado dentro de DataDragonProvider')
  }

  return context
}

