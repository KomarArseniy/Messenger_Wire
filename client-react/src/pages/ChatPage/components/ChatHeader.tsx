import { Avatar } from '@/components';
import type { Chat } from '@/types/chat';
import styles from './ChatHeader.module.scss';

interface ChatHeaderProps {
  chat: Chat;
}

export function ChatHeader({ chat }: ChatHeaderProps) {
  return (
    <header className={styles.header}>
      <Avatar name={chat.name} src={chat.avatar} size="md" />
      <div className={styles.info}>
        <span className={styles.name}>{chat.name ?? 'Без имени'}</span>
        <span
          className={`${styles.status} ${chat.isOnline ? styles.online : ''}`}
        >
          {chat.isOnline ? 'в сети' : 'не в сети'}
        </span>
      </div>
    </header>
  );
}
