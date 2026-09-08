import { useContext } from "react";
import { PatchVersionContext, PatchVersionType } from "./patch-version.context";

export const usePatchVersion = (): PatchVersionType => {
  const context = useContext(PatchVersionContext)
  if (context === undefined) {
    throw new Error(
      'PatchVersionContext deve ser utilizado dentro de PatchVersionProvider'
    )
  }

  return context as PatchVersionType
}