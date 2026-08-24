import { useEffect, useState } from "react"
import { ChampionDataDragon, ChampionsDataDragonDetailsSolo } from "../dtos/champion.dto"
import { customFetch } from "../utils/customFetch/customFetch"

export default function useChampionData(championId: string) {
  const [championData, setChampionData] = useState<ChampionsDataDragonDetailsSolo | undefined>(undefined)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (championId) {
      setLoading(true)
      setError(false)

      const url = `https://ddragon.leagueoflegends.com/cdn/12.6.1/data/pt_BR/champion/${championId}.json`
      customFetch<ChampionDataDragon>(url)
        .then((json) => {
          setChampionData(json.data[championId])
        })
        .catch(() => {
          setError(true)
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [championId])

  return { championData, loading, error }
}