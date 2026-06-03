import { useNavigate } from 'react-router-dom';
import { Button } from '@/components';
import { setFallbackToken } from '@/lib/httpClient';

export function ChatPage() {
  const navigate = useNavigate();

  function handleLogout() {
    setFallbackToken(null);
    navigate('/login');
  }

  return (
    <div style={{ padding: 32, display: 'grid', gap: 16 }}>
      <h1>Чат (скоро)</h1>
      <p>Вход выполнен. Интерфейс чата появится на следующих этапах.</p>
      <Button variant="secondary" onClick={handleLogout}>
        Выйти
      </Button>
    </div>
  );
}
