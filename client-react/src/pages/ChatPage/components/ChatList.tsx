import { Spinner } from '@/components';
import { EmptyState } from '@/components/EmptyState';
import {
  SearchIcon,
  GroupIcon,
  LogoutIcon,
  UserIcon,
} from '@/components/icons';
import { ChatListItem } from './ChatListItem';
import { SearchResults } from './SearchResults';
import noChatsAnim from '@/assets/lottie/no-chosen-chat.json';
import type { Chat } from '@/types/chat';
import type { SearchedUser } from '@/types/search';
import styles from './ChatList.module.scss';

interface ChatListProps {
  chats: Chat[] | undefined;
  isLoading: boolean;
  isError: boolean;
  activeChatId: number | null;
  search: string;
  onSearchChange: (value: string) => void;
  onCreateGroup: () => void;
  onSelect: (chatId: number) => void;
  onLogout: () => void;
  matchedChats: Chat[];
  searchResult: SearchedUser | null;
  searchStatus: 'idle' | 'loading' | 'notFound' | 'done';
  onSelectUser: (user: SearchedUser) => void;
  isCreatingChat: boolean;
  onOpenProfile: () => void;
}

export function ChatList({
  chats,
  isLoading,
  isError,
  activeChatId,
  search,
  onSearchChange,
  onCreateGroup,
  onSelect,
  onLogout,
  matchedChats,
  searchResult,
  searchStatus,
  onSelectUser,
  isCreatingChat,
  onOpenProfile,
}: ChatListProps) {
  const isSearching = search.trim().length > 0;

  return (
    <aside className={styles.sidebar}>
      <header className={styles.header}>
        <div className={styles.searchBox}>
          <SearchIcon className={styles.searchIcon} width={18} height={18} />
          <input
            className={styles.searchInput}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Поиск пользователей…"
          />
        </div>
        <button
          className={styles.iconBtn}
          onClick={onCreateGroup}
          aria-label="Создать групповой чат"
          title="Создать групповой чат"
        >
          <GroupIcon width={20} height={20} />
        </button>
      </header>

      <div className={styles.list}>
        {isSearching ? (
          <SearchResults
            matchedChats={matchedChats}
            activeChatId={activeChatId}
            onSelectChat={onSelect}
            result={searchResult}
            status={searchStatus}
            onSelectUser={onSelectUser}
            isCreating={isCreatingChat}
            query={search}
          />
        ) : (
          <>
            {isLoading && (
              <div className={styles.centered}>
                <Spinner />
              </div>
            )}
            {isError && <p className={styles.msg}>Не удалось загрузить чаты</p>}
            {!isLoading && !isError && chats && chats.length === 0 && (
              <EmptyState
                animation={noChatsAnim}
                title="Чатов пока нет"
                subtitle="Найдите пользователя, чтобы начать общение"
                size={160}
              />
            )}
            {!isError &&
              chats &&
              chats.map((chat) => (
                <ChatListItem
                  key={chat.id}
                  chat={chat}
                  isActive={activeChatId === chat.id}
                  onClick={() => onSelect(chat.id)}
                />
              ))}
          </>
        )}
      </div>

      <footer className={styles.footer}>
        <button className={styles.profileBtn} onClick={onOpenProfile}>
          <UserIcon width={18} height={18} />
          <span>Профиль</span>
        </button>
        <button className={styles.logoutBtn} onClick={onLogout}>
          <LogoutIcon width={18} height={18} />
          <span>Выйти</span>
        </button>
      </footer>
    </aside>
  );
}
