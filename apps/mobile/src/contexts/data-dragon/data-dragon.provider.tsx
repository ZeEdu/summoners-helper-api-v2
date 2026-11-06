import { PropsWithChildren, useEffect, useState } from "react";
import Loading from "../../app/screens/feedback/Loading";
import { ApiService } from "../../services/api/api.service";
import { usePatchVersion } from "../patchVersion/usePatchVersion";
import { DataDragonContext, DataDragonContextType, DataDragonLists, DataDragonMaps } from "./data-dragon.context";

export default function DataDragonProvider({ children }: PropsWithChildren) {
  const { version } = usePatchVersion()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | undefined>(undefined)

  const [lists, setLists] = useState<DataDragonLists>({ champions: [], items: [], runes: [], runeSlots: [], spells: [] })
  const [maps, setMaps] = useState<DataDragonMaps>({ champions: {}, items: {}, runes: {}, runeSlots: {}, spells: {} })

  const [patchVersion, setPatchVersion] = useState<string>('')

  const loadData = () => {
    if (!version) {
      return
    }

    setLoading(true)
    setError(undefined)

    ApiService.DataDragon.assets()
      .then(({ version, data }) => {
        setLists(data.lists)
        setMaps(data.maps)
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
    return maps.champions[id]
  }

  const getRuneSlots = (id: string) => {
    return maps.runeSlots[id]
  }

  const getSpell = (id: string) => {
    return maps.spells[id]
  }

  const getRune = (id: string) => {
    return maps.runes[id]
  }

  const getItem = (id: string) => {
    return maps.items[id]
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
    lists,
    maps,
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
      {loading ? <Loading i18nKey={'dataDragon'} /> : children}
    </DataDragonContext.Provider>
  )
}