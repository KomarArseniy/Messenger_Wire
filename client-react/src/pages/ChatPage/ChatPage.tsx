import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Avatar, Button, Spinner } from '@/components';
import { ClockIcon, CheckIcon, AlertIcon, SendIcon } from '@/components/icons';
import { useSessionStore } from '@/store/sessionStore';
import { useUiStore } from '@/store/uiStore';
import { useChats } from '@/hooks/useChats';
import { useMessages } from '@/hooks/useMessages';
import { useSendMessage } from '@/hooks/useSendMessage';
import { useSocketConnection } from '@/hooks/useSocketConnection';
import { joinRoom, disconnectSocket } from '@/lib/socket';
import { queryClient } from '@/lib/queryClient';

export function ChatPage() {
  const navigate = useNavigate();
  const user = useSessionStore((s) => s.user);
  const clearSession = useSessionStore((s) => s.clearSession);
  const activeChatId = useUiStore((s) => s.activeChatId);
  const setActiveChatId = useUiStore((s) => s.setActiveChatId);
  const [draft, setDraft] = useState('');

  useSocketConnection(user?.id);
  const send = useSendMessage(activeChatId);

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

      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
        }}
      >
        <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
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
                    key={msg.tempId ?? msg.id}
                    style={{
                      justifySelf: isMine ? 'end' : 'start',
                      background: isMine ? '#2f8fd6' : '#f4f4f5',
                      color: isMine ? '#fff' : '#1a1a1a',
                      padding: '8px 12px',
                      borderRadius: 12,
                      maxWidth: '75%',
                      display: 'flex',
                      alignItems: 'flex-end',
                      gap: 6,
                    }}
                  >
                    <span>{msg.content}</span>
                    {isMine && msg.status && (
                      <span
                        style={{
                          display: 'flex',
                          opacity: msg.status === 'error' ? 1 : 0.8,
                          color: msg.status === 'error' ? '#ffd7d7' : '#fff',
                        }}
                      >
                        {msg.status === 'sending' && <ClockIcon />}
                        {msg.status === 'sent' && <CheckIcon />}
                        {msg.status === 'error' && <AlertIcon />}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {activeChatId !== null && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(draft);
              setDraft('');
            }}
            style={{
              display: 'flex',
              gap: 8,
              padding: 16,
              borderTop: '1px solid #e5e7eb',
            }}
          >
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Сообщение…"
              style={{
                flex: 1,
                height: 40,
                padding: '0 14px',
                border: '1px solid #e5e7eb',
                borderRadius: 999,
                outline: 'none',
              }}
            />
            <button
              type="submit"
              disabled={!draft.trim()}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 40,
                height: 40,
                border: 'none',
                borderRadius: '50%',
                background: '#2f8fd6',
                color: '#fff',
                cursor: draft.trim() ? 'pointer' : 'not-allowed',
                opacity: draft.trim() ? 1 : 0.5,
              }}
            >
              <SendIcon width={18} height={18} />
            </button>
          </form>
        )}
      </main>
    </div>
  );
}
