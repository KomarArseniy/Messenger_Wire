import { useState, useEffect } from 'react';
import { searchUser } from '@/api/chatApi';
import { HttpError } from '@/lib/httpClient';
import type { SearchedUser } from '@/types/search';

type SearchStatus = 'idle' | 'loading' | 'notFound' | 'done';

interface SearchState {
  result: SearchedUser | null;
  status: SearchStatus;
}

const IDLE: SearchState = { result: null, status: 'idle' };

export function useUserSearch(query: string) {
  const [state, setState] = useState<SearchState>(IDLE);
  const trimmed = query.trim();

  useEffect(() => {
    if (!trimmed) return;

    let cancelled = false;

    const timer = setTimeout(async () => {
      setState({ result: null, status: 'loading' });
      try {
        const res = await searchUser(trimmed);
        if (cancelled) return;
        if (res.success && res.userData) {
          setState({ result: res.userData, status: 'done' });
        } else {
          setState({ result: null, status: 'notFound' });
        }
      } catch (err) {
        if (cancelled) return;
        const notFound = err instanceof HttpError && err.status === 404;
        setState({ result: null, status: notFound ? 'notFound' : 'idle' });
      }
    }, 400);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [trimmed]);

  return trimmed ? state : IDLE;
}
