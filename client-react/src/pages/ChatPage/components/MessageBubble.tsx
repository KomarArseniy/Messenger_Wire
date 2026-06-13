import {
  ClockIcon,
  CheckIcon,
  DoubleCheckIcon,
  AlertIcon,
} from '@/components/icons';
import { formatTime } from '@/lib/datetime';
import type { Message } from '@/types/message';
import styles from './MessageBubble.module.scss';

interface MessageBubbleProps {
  message: Message;
  isMine: boolean;
}

export function MessageBubble({ message, isMine }: MessageBubbleProps) {
  return (
    <div className={`${styles.row} ${isMine ? styles.mine : styles.theirs}`}>
      <div className={styles.bubble}>
        <span className={styles.content}>{message.content}</span>
        <span className={styles.meta}>
          <span className={styles.time}>{formatTime(message.created_at)}</span>
          {isMine && message.status && (
            <span className={styles.status}>
              {message.status === 'sending' && <ClockIcon />}
              {message.status === 'sent' && <CheckIcon />}
              {message.status === 'read' && <DoubleCheckIcon />}
              {message.status === 'error' && (
                <AlertIcon className={styles.errorIcon} />
              )}
            </span>
          )}
        </span>
      </div>
    </div>
  );
}
