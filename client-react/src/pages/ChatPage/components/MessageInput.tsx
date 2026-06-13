import { useState } from 'react';
import type { FormEvent } from 'react';
import { SendIcon } from '@/components/icons';
import styles from './MessageInput.module.scss';

interface MessageInputProps {
  onSend: (text: string) => void;
}

export function MessageInput({ onSend }: MessageInputProps) {
  const [draft, setDraft] = useState('');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    onSend(text);
    setDraft('');
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        className={styles.input}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        placeholder="Написать сообщение…"
      />
      <button
        type="submit"
        className={styles.button}
        disabled={!draft.trim()}
        aria-label="Отправить"
      >
        <SendIcon width={18} height={18} />
      </button>
    </form>
  );
}
