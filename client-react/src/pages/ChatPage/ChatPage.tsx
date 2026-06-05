import { useNavigate } from 'react-router-dom';
import { Button } from '@/components';
import { useSessionStore } from '@/store/sessionStore';

export function ChatPage() {
  const navigate = useNavigate();
  const user = useSessionStore((s) => s.user);
  const clearSession = useSessionStore((s) => s.clearSession);

  function handleLogout() {
    clearSession();
    navigate('/login');
  }

  return (
    <div style={{ padding: 32, display: 'grid', gap: 16 }}>
      <h1>Чат (скоро)</h1>
      <p>
        Вход выполнен как {user?.username ?? 'пользователь'}. Интерфейс чата
        появится на следующих этапах.
      </p>
      <Button variant="secondary" onClick={handleLogout}>
        Выйти
      </Button>
    </div>
  );
}
