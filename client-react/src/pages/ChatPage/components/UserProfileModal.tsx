import { Modal, Avatar } from '@/components';
import type { Chat } from '@/types/chat';
import styles from './UserProfileModal.module.scss';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  chat: Chat | null;
}

export function UserProfileModal({
  isOpen,
  onClose,
  chat,
}: UserProfileModalProps) {
  if (!chat) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Профиль">
      <div className={styles.wrapper}>
        <Avatar name={chat.name} src={chat.avatar} size="xl" />
        <h3 className={styles.name}>{chat.name ?? 'Без имени'}</h3>
        {chat.partnerUsername && (
          <span className={styles.username}>@{chat.partnerUsername}</span>
        )}
        <span
          className={`${styles.status} ${chat.isOnline ? styles.online : ''}`}
        >
          {chat.isOnline ? 'в сети' : 'не в сети'}
        </span>

        {chat.partnerAbout && (
          <div className={styles.aboutBlock}>
            <p className={styles.aboutLabel}>О себе</p>
            <p className={styles.about}>{chat.partnerAbout}</p>
          </div>
        )}
      </div>
    </Modal>
  );
}
