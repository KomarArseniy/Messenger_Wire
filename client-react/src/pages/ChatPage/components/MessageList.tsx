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
  const prevCountRef = useRef(0);

  useEffect(() => {
    const count = messages?.length ?? 0;
    const isFirstLoad = prevCountRef.current === 0 && count > 0;
    const hasNew = count > prevCountRef.current;
    prevCountRef.current = count;

    // Мгновенный скролл (без smooth) — не перерисовывает десятки кадров
    // поверх тяжёлого фона. Скроллим только при первой загрузке или новом сообщении
    if (isFirstLoad || hasNew) {
      bottomRef.current?.scrollIntoView({ behavior: 'auto' });
    }
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
      <div className={styles.emptyPlate}>
        <div className={styles.errorPlateInner}>
          Не удалось загрузить сообщения
        </div>
      </div>
    );
  }

  if (!messages || messages.length === 0) {
    return (
      <div className={styles.emptyPlate}>
        <div className={styles.emptyPlateInner}>
          <EmptyState
            animation={noMessagesAnim}
            title="Сообщений пока нет"
            subtitle="Напишите первым — начните разговор"
            titleColor="#ffffff"
            size={160}
          />
        </div>
      </div>
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
