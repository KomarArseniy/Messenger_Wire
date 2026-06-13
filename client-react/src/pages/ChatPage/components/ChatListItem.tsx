import { Avatar } from '@/components';
import type { Chat } from '@/types/chat';
import styles from './ChatListItem.module.scss';

interface ChatListItemProps {
  chat: Chat;
  isActive: boolean;
  onClick: () => void;
}

export function ChatListItem({ chat, isActive, onClick }: ChatListItemProps) {
  return (
    <button
      className={`${styles.item} ${isActive ? styles.active : ''}`}
      onClick={onClick}
    >
      <div className={styles.avatarWrap}>
        <Avatar name={chat.name} src={chat.avatar} />
        {chat.isOnline && <span className={styles.onlineDot} />}
      </div>
      <div className={styles.body}>
        <span className={styles.name}>{chat.name ?? 'Без имени'}</span>
        <span className={styles.last}>
          {chat.lastMessage ?? 'Нет сообщений'}
        </span>
      </div>
      {chat.unreadCount > 0 && (
        <span className={styles.badge}>{chat.unreadCount}</span>
      )}
    </button>
  );
}
