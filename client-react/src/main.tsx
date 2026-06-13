import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import '@/styles/global.scss';
import App from './App.tsx';
import {
  setAccessTokenGetter,
  setAccessTokenSetter,
  setOnAuthFailure,
} from '@/lib/httpClient';
import { useSessionStore } from '@/store/sessionStore';
import { queryClient } from '@/lib/queryClient';
import { disconnectSocket } from '@/lib/socket';

setAccessTokenGetter(() => useSessionStore.getState().accessToken);
setAccessTokenSetter((token) =>
  useSessionStore.getState().setAccessToken(token),
);
setOnAuthFailure(() => {
  disconnectSocket();
  useSessionStore.getState().clearSession();
  queryClient.clear();
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
);
