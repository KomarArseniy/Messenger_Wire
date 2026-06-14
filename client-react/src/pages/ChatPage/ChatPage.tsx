import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { EmptyState } from '@/components/EmptyState';
import { useSessionStore } from '@/store/sessionStore';
import { useUiStore } from '@/store/uiStore';
import { useChats } from '@/hooks/useChats';
import { useMessages } from '@/hooks/useMessages';
import { useSendMessage } from '@/hooks/useSendMessage';
import { useSocketConnection } from '@/hooks/useSocketConnection';
import { useIncomingMessages } from '@/hooks/useIncomingMessages';
import { joinRoom, disconnectSocket, markRead } from '@/lib/socket';
import { queryClient } from '@/lib/queryClient';
import { ChatList, ChatHeader, MessageList, MessageInput } from './components';
import noChosenChatAnim from '@/assets/lottie/no-chosen-chat.json';
import styles from './ChatPage.module.scss';

export function ChatPage() {
  const navigate = useNavigate();
  const user = useSessionStore((s) => s.user);
  const accessToken = useSessionStore((s) => s.accessToken);
  const clearSession = useSessionStore((s) => s.clearSession);
  const activeChatId = useUiStore((s) => s.activeChatId);
  const setActiveChatId = useUiStore((s) => s.setActiveChatId);
  const [search, setSearch] = useState('');

  const isConnected = useSocketConnection(accessToken);
  useIncomingMessages(isConnected, activeChatId, user?.id);
  const send = useSendMessage(activeChatId);

  const { data: chats, isLoading, isError } = useChats();
  const {
    data: messages,
    isLoading: messagesLoading,
    isError: messagesError,
  } = useMessages(activeChatId);

  const activeChat = chats?.find((c) => c.id === activeChatId) ?? null;

  useEffect(() => {
    if (activeChatId !== null && user) {
      joinRoom(activeChatId).then(() => {
        markRead(activeChatId);
        queryClient.invalidateQueries({ queryKey: ['chats'] });
      });
    }
  }, [activeChatId, user]);

  function handleLogout() {
    disconnectSocket();
    clearSession();
    queryClient.clear();
    setActiveChatId(null);
    navigate('/login');
  }

  return (
    <div className={styles.page}>
      <ChatList
        chats={chats}
        isLoading={isLoading}
        isError={isError}
        activeChatId={activeChatId}
        search={search}
        onSearchChange={setSearch}
        onCreateGroup={() => {}}
        onSelect={setActiveChatId}
        onLogout={handleLogout}
      />

      <main className={styles.main}>
        {activeChat === null ? (
          <EmptyState
            animation={noChosenChatAnim}
            title="Выберите чат"
            subtitle="Откройте диалог слева, чтобы начать общение"
          />
        ) : (
          <>
            <ChatHeader chat={activeChat} />
            <div className={styles.messages}>
              <MessageList
                messages={messages}
                isLoading={messagesLoading}
                isError={messagesError}
                myId={user?.id}
              />
            </div>
            <MessageInput onSend={send} />
          </>
        )}
      </main>
    </div>
  );
}
