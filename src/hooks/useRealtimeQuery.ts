import { useEffect, useState } from 'react';
import { QueryKey, skipToken, useQuery, useQueryClient } from '@tanstack/react-query';

// Stable key string lets subscriptions restart only when their actual key changes.
export const useRealtimeQuery = <T,>(key: QueryKey, subscribe: (next: (value: T) => void, fail: (error: Error) => void) => () => void, enabled = true) => {
  const client = useQueryClient();
  const [attempt, setAttempt] = useState(0);
  const keyString = JSON.stringify(key);
  const result = useQuery<T>({ queryKey: key, queryFn: skipToken });

  useEffect(() => {
    if (!enabled) return;
    const queryKey: QueryKey = JSON.parse(keyString);
    let active = true;
    const query = client.getQueryCache().find({ queryKey, exact: true });
    query?.setState({ error: null, status: query.state.data === undefined ? 'pending' : 'success' });
    const unsubscribe = subscribe(value => {
      if (active) client.setQueryData(queryKey, value);
    }, error => {
      if (active) client.getQueryCache().find({ queryKey, exact: true })?.setState({ error, status: 'error', fetchStatus: 'idle' });
    });
    return () => { active = false; unsubscribe(); };
  }, [client, keyString, subscribe, enabled, attempt]);

  return {
    ...result,
    isLoading: enabled && result.isPending,
    refetch: async () => { setAttempt(value => value + 1); },
  };
};
