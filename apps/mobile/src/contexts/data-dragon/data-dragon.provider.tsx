import { PropsWithChildren, useEffect, useState } from "react";
import { RunesReforgedDataDragon } from "../../dtos/runes-reforged.dto";
import { SummonerSpell } from "../../dtos/spell.dto";
import { ApiService } from "../../services/api/api.service";
import { usePatchVersion } from "../patchVersion/usePatchVersion";
import { DataDragon, DataDragonContext, DataDragonContextType, DataDragonMaps } from "./data-dragon.context";

async function loadChampionList(version: string) {
  const json = await ApiService.DataDragon.champions(version)

  const list = Object.values(json.data)
  const map = json.data

  return { list, map }
}

async function loadSummonerSpells(version: string) {
  const json = await ApiService.DataDragon.spells(version)

  const list = Object.values(json.data)
    .filter((spell) => spell.modes.includes('CLASSIC'))
  const map = list.reduce((previousValue, currentValue) => {
    return { ...previousValue, [currentValue.id]: currentValue }
  }, {} as Record<string, SummonerSpell>)

  return { list, map }
}

async function loadRunesReforged(version: string) {
  const json = await ApiService.DataDragon.runes(version)

  const map = json
    .reduce(
      (previousValue: Record<string, RunesReforgedDataDragon>, currentValue: RunesReforgedDataDragon) =>
        ({ ...previousValue, [currentValue.id.toString()]: currentValue }), {} as Record<string, RunesReforgedDataDragon>
    )

  return { list: json, map }
}

async function loadItems(version: string) {
  const json = await ApiService.DataDragon.items(version)

  const map = json.data
  const list = Object.keys(json.data).map((key) => ({ ...json.data[key], id: key }))

  return { list, map }
}

async function init(version: string) {
  const champions = await loadChampionList(version)
  const spells = await loadSummonerSpells(version)
  const runes = await loadRunesReforged(version)
  const items = await loadItems(version)

  return {
    champions,
    spells,
    runes,
    items
  }
}

export default function DataDragonProvider({ children }: PropsWithChildren) {
  const { version } = usePatchVersion()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | undefined>(undefined)

  const [dataDragon, setDataDragon] = useState<DataDragon | undefined>(undefined)
  const [dataDragonMaps, setDataDragonMaps] = useState<DataDragonMaps | undefined>(undefined)

  const loadData = () => {
    if (!version) {
      return
    }

    setLoading(true)
    setError(undefined)
    init(version)
      .then(({ champions, spells, runes, items }) => {
        setDataDragon({
          champions: champions.list,
          spells: spells.list,
          runes: runes.list,
          items: items.list
        })

        setDataDragonMaps({
          champions: champions.map,
          spells: spells.map,
          runes: runes.map,
          items: items.map
        })
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

  useEffect(() => {
    loadData()
  }, [version])

  const value: DataDragonContextType = { loading, error, dataDragon, dataDragonMaps, reload }

  return (
    <DataDragonContext.Provider value={value}>
      {children}
    </DataDragonContext.Provider>
  )
}