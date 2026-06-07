import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import '@/styles/global.scss';
import App from './App.tsx';
import { setAccessTokenGetter } from '@/lib/httpClient';
import { useSessionStore } from '@/store/sessionStore';
import { queryClient } from '@/lib/queryClient';

setAccessTokenGetter(() => useSessionStore.getState().accessToken);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
);
