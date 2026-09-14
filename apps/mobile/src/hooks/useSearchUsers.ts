import { IUser } from "@org/contracts"
import { useEffect, useState } from "react"
import { ApiService } from "../services/api/api.service"

// TODO: Melhorar a lógica do reset, para algo mais elegante
// TODO: Criar uma lógica de busca via tokens nos guias
export default function useSearchUsers(searchTerm: string) {
  const [users, setUsers] = useState<IUser[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [isSearchResult, setIsSearchResult] = useState(false)

  const [debouncedInput, setDebouncedInput] = useState('')

  const clear = () => {
    setUsers([])
    setLoading(false)
    setError(false)
    setIsSearchResult(false)
  }

  useEffect(() => {
    if (!searchTerm) {
      setDebouncedInput(searchTerm)
      return
    }

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
      setIsSearchResult(false)

      ApiService
        .Users
        .quickSearch({ username: debouncedInput, limit: 5 })
        .then(({ users }) => {
          setUsers(users)
          setIsSearchResult(true)
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

  return { users, loading, error, isSearchResult }
}