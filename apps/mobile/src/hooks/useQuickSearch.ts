import { IGuide } from "@org/contracts"
import { useEffect, useState } from "react"
import { ApiService } from "../services/api/api.service"

// TODO: Melhorar a lógica do reset, para algo mais elegante
export default function useQuickSearch(searchTerm: string) {
  const [guides, setGuides] = useState<IGuide[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  const [debouncedInput, setDebouncedInput] = useState('')

  const clear = () => {
    setGuides([])
  }

  const reset = () => {
    setDebouncedInput('')
  }

  useEffect(() => {
    const setQuery = setTimeout(() => {
      setDebouncedInput(searchTerm)
    }, 500)

    return () => {
      clearTimeout(setQuery)
    }
  }, [searchTerm])

  useEffect(() => {
    const getGuides = () => {
      setLoading(true)
      setError(false)

      ApiService
        .Guides
        .get({ title: debouncedInput })
        .then((json) => {
          setGuides(json.guides)
        })
        .catch(() => {
          setError(true)
        })
        .finally(() => {
          setLoading(false)
        })

    }
    if (debouncedInput) {
      getGuides()
    } else {
      clear()
    }
  }, [debouncedInput])

  return { guides, loading, error, reset }
}