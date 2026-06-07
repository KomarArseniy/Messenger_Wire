import { useNavigate } from 'react-router-dom';
import { Avatar, Button, Spinner } from '@/components';
import { useSessionStore } from '@/store/sessionStore';
import { useChats } from '@/hooks/useChats';

export function ChatPage() {
  const navigate = useNavigate();
  const user = useSessionStore((s) => s.user);
  const clearSession = useSessionStore((s) => s.clearSession);
  const { data: chats, isLoading, isError } = useChats();

  function handleLogout() {
    clearSession();
    navigate('/login');
  }

  return (
    <div style={{ padding: 32, display: 'grid', gap: 16, maxWidth: 480 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h1>Чаты</h1>
        <Button variant="secondary" size="sm" onClick={handleLogout}>
          Выйти
        </Button>
      </div>

      <p>Вы вошли как {user?.username ?? 'пользователь'}.</p>

      {isLoading && <Spinner />}
      {isError && <p>Не удалось загрузить чаты</p>}

      {chats && chats.length === 0 && <p>Чатов пока нет</p>}

      {chats && chats.length > 0 && (
        <div style={{ display: 'grid', gap: 8 }}>
          {chats.map((chat) => (
            <div
              key={chat.id}
              style={{ display: 'flex', gap: 12, alignItems: 'center' }}
            >
              <Avatar name={chat.name} src={chat.avatar} />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 600 }}>
                  {chat.name ?? 'Без имени'}
                </div>
                <div
                  style={{
                    color: '#6b7280',
                    fontSize: 13,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {chat.lastMessage ?? 'Нет сообщений'}
                </div>
              </div>
              {chat.unreadCount > 0 && (
                <span
                  style={{
                    marginLeft: 'auto',
                    background: '#2f8fd6',
                    color: '#fff',
                    borderRadius: 999,
                    padding: '2px 8px',
                    fontSize: 12,
                  }}
                >
                  {chat.unreadCount}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
