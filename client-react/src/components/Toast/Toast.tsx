import { useEffect, useState } from 'react';
import { Avatar } from '@/components';
import { useToastStore } from '@/store/toastStore';
import type { Toast } from '@/store/toastStore';
import styles from './Toast.module.scss';

interface ToastItemProps {
  toast: Toast;
}

function ToastItem({ toast }: ToastItemProps) {
  const removeToast = useToastStore((s) => s.removeToast);
  const [leaving, setLeaving] = useState(false);

  function dismiss() {
    setLeaving(true);
    setTimeout(() => removeToast(toast.id), 300);
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setLeaving(true);
      setTimeout(() => removeToast(toast.id), 300);
    }, 5000);
    return () => clearTimeout(timer);
  }, [toast.id, removeToast]);

  return (
    <div
      className={`${styles.toast} ${leaving ? styles.leaving : ''}`}
      onClick={dismiss}
      role="button"
    >
      <Avatar name={toast.chatName} src={toast.avatar} size="sm" />
      <div className={styles.body}>
        <span className={styles.name}>{toast.chatName}</span>
        <span className={styles.message}>{toast.message}</span>
      </div>
    </div>
  );
}

export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);

  if (toasts.length === 0) return null;

  return (
    <div className={styles.container}>
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
}
