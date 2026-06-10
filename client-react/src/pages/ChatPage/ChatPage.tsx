import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Avatar, Button, Spinner } from '@/components';
import { useSessionStore } from '@/store/sessionStore';
import { useUiStore } from '@/store/uiStore';
import { useChats } from '@/hooks/useChats';
import { useMessages } from '@/hooks/useMessages';
import { useSocketConnection } from '@/hooks/useSocketConnection';
import { joinRoom, disconnectSocket } from '@/lib/socket';
import { queryClient } from '@/lib/queryClient';

export function ChatPage() {
  const navigate = useNavigate();
  const user = useSessionStore((s) => s.user);
  const clearSession = useSessionStore((s) => s.clearSession);
  const activeChatId = useUiStore((s) => s.activeChatId);
  const setActiveChatId = useUiStore((s) => s.setActiveChatId);

  useSocketConnection(user?.id);

  useEffect(() => {
    if (activeChatId !== null) {
      joinRoom(activeChatId);
    }
  }, [activeChatId]);

  const { data: chats, isLoading, isError } = useChats();
  const {
    data: messages,
    isLoading: messagesLoading,
    isError: messagesError,
  } = useMessages(activeChatId);

  function handleLogout() {
    disconnectSocket();
    clearSession();
    queryClient.clear();
    setActiveChatId(null);
    navigate('/login');
  }

  return (
    <div style={{ height: '100vh', display: 'flex' }}>
      <aside
        style={{
          width: 320,
          borderRight: '1px solid #e5e7eb',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            padding: 16,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #e5e7eb',
          }}
        >
          <span style={{ fontWeight: 600 }}>
            {user?.username ?? user?.login ?? 'пользователь'}
          </span>
          <Button variant="secondary" size="sm" onClick={handleLogout}>
            Выйти
          </Button>
        </div>

        <div style={{ overflowY: 'auto', flex: 1 }}>
          {isLoading && (
            <div style={{ padding: 16 }}>
              <Spinner />
            </div>
          )}
          {isError && <p style={{ padding: 16 }}>Не удалось загрузить чаты</p>}
          {!isLoading && !isError && chats && chats.length === 0 && (
            <p style={{ padding: 16 }}>Чатов пока нет</p>
          )}
          {!isError &&
            chats &&
            chats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => setActiveChatId(chat.id)}
                style={{
                  width: '100%',
                  display: 'flex',
                  gap: 12,
                  alignItems: 'center',
                  padding: 12,
                  border: 'none',
                  background:
                    activeChatId === chat.id ? '#eaf2f8' : 'transparent',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <Avatar name={chat.name} src={chat.avatar} />
                <div style={{ minWidth: 0, flex: 1 }}>
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
              </button>
            ))}
        </div>
      </aside>

      <main style={{ flex: 1, padding: 24, overflowY: 'auto' }}>
        {activeChatId === null && <p>Выберите чат</p>}
        {activeChatId !== null && messagesLoading && <Spinner />}
        {activeChatId !== null && messagesError && (
          <p>Не удалось загрузить сообщения</p>
        )}
        {activeChatId !== null &&
          messages &&
          messages.length === 0 &&
          !messagesLoading && <p>Сообщений пока нет</p>}
        {activeChatId !== null && messages && messages.length > 0 && (
          <div style={{ display: 'grid', gap: 8, maxWidth: 600 }}>
            {messages.map((msg) => {
              const isMine = msg.sender_id === user?.id;
              return (
                <div
                  key={msg.id}
                  style={{
                    justifySelf: isMine ? 'end' : 'start',
                    background: isMine ? '#2f8fd6' : '#f4f4f5',
                    color: isMine ? '#fff' : '#1a1a1a',
                    padding: '8px 12px',
                    borderRadius: 12,
                    maxWidth: '75%',
                  }}
                >
                  {msg.content}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
