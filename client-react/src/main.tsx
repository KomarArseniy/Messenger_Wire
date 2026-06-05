import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@/styles/global.scss';
import App from './App.tsx';
import { setAccessTokenGetter } from '@/lib/httpClient';
import { useSessionStore } from '@/store/sessionStore';

setAccessTokenGetter(() => useSessionStore.getState().accessToken);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
