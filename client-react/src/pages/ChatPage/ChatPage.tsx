import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSessionStore } from '@/store/sessionStore';
import { useUiStore } from '@/store/uiStore';
import { useChats } from '@/hooks/useChats';
import { useMessages } from '@/hooks/useMessages';
import { useSendMessage } from '@/hooks/useSendMessage';
import { useSocketConnection } from '@/hooks/useSocketConnection';
import { useIncomingMessages } from '@/hooks/useIncomingMessages';
import { useUserSearch } from '@/hooks/useUserSearch';
import { useCreatePrivateChat } from '@/hooks/useCreatePrivateChat';
import { joinRoom, disconnectSocket, markRead, joinChat } from '@/lib/socket';
import { queryClient } from '@/lib/queryClient';
import {
  ChatList,
  ChatHeader,
  MessageList,
  MessageInput,
  ProfileModal,
  UserProfileModal,
} from './components';
import { ToastContainer } from '@/components';
import type { SearchedUser } from '@/types/search';
import styles from './ChatPage.module.scss';

export function ChatPage() {
  const navigate = useNavigate();
  const user = useSessionStore((s) => s.user);
  const accessToken = useSessionStore((s) => s.accessToken);
  const clearSession = useSessionStore((s) => s.clearSession);
  const activeChatId = useUiStore((s) => s.activeChatId);
  const setActiveChatId = useUiStore((s) => s.setActiveChatId);
  const [search, setSearch] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);
  const [userProfileOpen, setUserProfileOpen] = useState(false);
  const { result: searchResult, status: searchStatus } = useUserSearch(search);
  const createChat = useCreatePrivateChat();

  async function handleSelectUser(user: SearchedUser) {
    try {
      const res = await createChat.mutateAsync(user.id);
      if (res.chatId) {
        joinChat(res.chatId);
        setActiveChatId(res.chatId);
        setSearch('');
      }
    } catch {
      // ошибка создания чата — оставляем поиск открытым
    }
  }

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

  const matchedChats = (() => {
    const q = search.trim().toLowerCase();
    if (!q || !chats) return [];
    return chats.filter((c) => (c.name ?? '').toLowerCase().includes(q));
  })();

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
    <div
      className={`${styles.page} ${activeChatId !== null ? styles.chatOpen : ''}`}
    >
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
        matchedChats={matchedChats}
        searchResult={searchResult}
        searchStatus={searchStatus}
        onSelectUser={handleSelectUser}
        isCreatingChat={createChat.isPending}
        onOpenProfile={() => setProfileOpen(true)}
      />

      <main className={styles.main}>
        {activeChat === null ? (
            <div className={styles.watermark}>
              WIRE
            </div>
        ) : (
          <>
            <ChatHeader
              chat={activeChat}
              onClick={() => setUserProfileOpen(true)}
              onBack={() => setActiveChatId(null)}
            />
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

      <ProfileModal
        isOpen={profileOpen}
        onClose={() => setProfileOpen(false)}
      />

      <UserProfileModal
        isOpen={userProfileOpen}
        onClose={() => setUserProfileOpen(false)}
        chat={activeChat}
      />

      <ToastContainer />
    </div>
  );
}
