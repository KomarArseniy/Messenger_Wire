import { Avatar } from '@/components';
import { BackIcon } from '@/components/icons';
import type { Chat } from '@/types/chat';
import styles from './ChatHeader.module.scss';

interface ChatHeaderProps {
  chat: Chat;
  onClick?: () => void;
  onBack?: () => void;
}

export function ChatHeader({ chat, onClick, onBack }: ChatHeaderProps) {
  return (
    <header className={styles.header}>
      {onBack && (
        <button
          className={styles.backBtn}
          onClick={(e) => {
            e.stopPropagation();
            onBack();
          }}
          aria-label="Назад"
        >
          <BackIcon width={22} height={22} />
        </button>
      )}
      <div
        className={styles.main}
        onClick={onClick}
        role={onClick ? 'button' : undefined}
      >
        <Avatar name={chat.name} src={chat.avatar} size="md" />
        <div className={styles.info}>
          <span className={styles.name}>{chat.name ?? 'Без имени'}</span>
          <span
            className={`${styles.status} ${chat.isOnline ? styles.online : ''}`}
          >
            {chat.isOnline ? 'в сети' : 'не в сети'}
          </span>
        </div>
      </div>
    </header>
  );
}
