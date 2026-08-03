import { useEffect, useState } from 'react';

import { customFetch } from '../utils/customFetch/customFetch';

export const useFetch = <T>(
  url: string,
  init: RequestInit | undefined = undefined,
) => {
  const [data, setData] = useState<T | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<unknown | undefined>(undefined);

  useEffect(() => {
    setLoading(true);
    setError(undefined);
    setData(undefined);

    const fetchData = async () => {
      if (!url) return;

      try {
        const response = await customFetch<T>(url, init);
        setData(response);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, JSON.stringify(init)]);

  return { data, loading, error };
};
