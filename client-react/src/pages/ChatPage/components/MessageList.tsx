import { useEffect, useRef } from 'react';
import { Spinner } from '@/components';
import { EmptyState } from '@/components/EmptyState';
import { MessageBubble } from './MessageBubble';
import { formatDateLabel } from '@/lib/datetime';
import noMessagesAnim from '@/assets/lottie/no-messages.json';
import type { Message } from '@/types/message';
import styles from './MessageList.module.scss';

interface MessageListProps {
  messages: Message[] | undefined;
  isLoading: boolean;
  isError: boolean;
  myId: number | undefined;
}

export function MessageList({
  messages,
  isLoading,
  isError,
  myId,
}: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (isLoading) {
    return (
      <div className={styles.centered}>
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className={styles.centered}>Не удалось загрузить сообщения</div>
    );
  }

  if (!messages || messages.length === 0) {
    return (
      <EmptyState
        animation={noMessagesAnim}
        title="Сообщений пока нет"
        subtitle="Напишите первым — начните разговор"
      />
    );
  }

  const items = messages.map((msg, i) => {
    const dateLabel = formatDateLabel(msg.created_at);
    const prevLabel =
      i > 0 ? formatDateLabel(messages[i - 1].created_at) : null;
    return { msg, dateLabel, showDivider: dateLabel !== prevLabel };
  });

  return (
    <div className={styles.list}>
      {items.map(({ msg, dateLabel, showDivider }) => (
        <div key={msg.tempId ?? msg.id}>
          {showDivider && (
            <div className={styles.divider}>
              <span>{dateLabel}</span>
            </div>
          )}
          <MessageBubble message={msg} isMine={msg.sender_id === myId} />
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
