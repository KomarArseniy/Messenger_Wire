import { Avatar, Button, Spinner } from '@/components';
import { EmptyState } from '@/components/EmptyState';
import { ChatListItem } from './ChatListItem';
import noChatsAnim from '@/assets/lottie/no-chosen-chat.json';
import type { Chat } from '@/types/chat';
import type { User } from '@/types/user';
import styles from './ChatList.module.scss';

interface ChatListProps {
  chats: Chat[] | undefined;
  isLoading: boolean;
  isError: boolean;
  activeChatId: number | null;
  user: User | null;
  onSelect: (chatId: number) => void;
  onLogout: () => void;
}

export function ChatList({
  chats,
  isLoading,
  isError,
  activeChatId,
  user,
  onSelect,
  onLogout,
}: ChatListProps) {
  return (
    <aside className={styles.sidebar}>
      <header className={styles.header}>
        <div className={styles.me}>
          <Avatar
            name={user?.full_name ?? user?.username ?? user?.login ?? null}
            src={user?.avatar_url}
            size="sm"
          />
          <span className={styles.meName}>
            {user?.username ?? user?.login ?? 'пользователь'}
          </span>
        </div>
        <Button variant="ghost" size="sm" onClick={onLogout}>
          Выйти
        </Button>
      </header>

      <div className={styles.list}>
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
      </div>
    </aside>
  );
}
