import { createContext } from "react"

export type PatchVersionType = {
  version: string | undefined
}

export const PatchVersionContext = createContext<PatchVersionType | undefined>(undefined)