import { PropsWithChildren, useEffect, useState } from "react";
import { ApiService } from "../../services/api/api.service";
import { usePatchVersion } from "../patchVersion/usePatchVersion";
import { DataDragonContext, DataDragonContextType, DataDragonLists, DataDragonMaps } from "./data-dragon.context";

// Migrar as chamadas individuais para a chamada ao get-assets da api local
export default function DataDragonProvider({ children }: PropsWithChildren) {
  const { version } = usePatchVersion()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | undefined>(undefined)

  const [dataDragonLists, setDataDragonLists] = useState<DataDragonLists>({ champions: [], items: [], runes: [], runeSlots: [], spells: [] })
  const [dataDragonMaps, setDataDragonMaps] = useState<DataDragonMaps>({ champions: {}, items: {}, runes: {}, runeSlots: {}, spells: {} })

  const [patchVersion, setPatchVersion] = useState<string>('')

  const loadData = () => {
    if (!version) {
      return
    }

    setLoading(true)
    setError(undefined)
    ApiService.DataDragon.assets()
      .then(({ version, data }) => {
        setDataDragonLists(data.lists)
        setDataDragonMaps(data.maps)
        setPatchVersion(version)
      })
      .catch(() => {
        setError('Um erro ocorreu ao tentar carregar os dados da aplicação')
      })
      .finally(() => {
        setLoading(false)
      })
  }


  const reload = () => {
    loadData()
  }

  const getChampion = (id: string) => {
    return dataDragonMaps.champions[id]
  }

  const getRuneSlots = (id: string) => {
    return dataDragonMaps.runeSlots[id]
  }

  const getSpell = (id: string) => {
    return dataDragonMaps.spells[id]
  }

  const getRune = (id: string) => {
    return dataDragonMaps.runes[id]
  }

  const getItem = (id: string) => {
    return dataDragonMaps.items[id]
  }

  const getPatch = () => {
    return patchVersion
  }

  useEffect(() => {
    loadData()
  }, [version])

  const value: DataDragonContextType = {
    loading,
    error,
    dataDragonLists,
    dataDragonMaps,
    reload,
    getChampion,
    getSpell,
    getRune,
    getRuneSlots,
    getItem,
    getPatch
  }

  return (
    <DataDragonContext.Provider value={value}>
      {children}
    </DataDragonContext.Provider>
  )
}