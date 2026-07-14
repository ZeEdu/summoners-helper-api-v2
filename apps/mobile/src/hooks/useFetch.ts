import { useState, useEffect } from 'react';

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
        const response = await fetch(url, init);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        setData(result);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [init, url]);

  return { data, loading, error };
};
