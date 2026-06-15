import { useState } from 'react';
import { Modal, Avatar, Button } from '@/components';
import { updateProfileField } from '@/api/profileApi';
import { HttpError } from '@/lib/httpClient';
import { useSessionStore } from '@/store/sessionStore';
import type { ProfileField } from '@/api/profileApi';
import type { User } from '@/types/user';
import styles from './ProfileModal.module.scss';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FIELDS: { key: ProfileField; label: string; storeKey: keyof User }[] = [
  { key: 'username', label: 'Имя пользователя', storeKey: 'username' },
  { key: 'fullname', label: 'Полное имя', storeKey: 'full_name' },
  { key: 'about', label: 'О себе', storeKey: 'about' },
];

export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const user = useSessionStore((s) => s.user);
  const setSession = useSessionStore((s) => s.setSession);
  const accessToken = useSessionStore((s) => s.accessToken);

  const initial: Record<string, string> = {
    username: user?.username ? `@${user.username.replace(/^@/, '')}` : '',
    fullname: user?.full_name ?? '',
    about: user?.about ?? '',
  };

  const [values, setValues] = useState<Record<string, string>>(initial);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState<Record<string, boolean>>({});

  async function handleSave(field: ProfileField, storeKey: keyof User) {
    const raw = values[field]?.trim();
    if (!raw || !user || !accessToken) return;

    const value = field === 'username' ? raw.replace(/^@+/, '') : raw;
    if (!value) return;

    setSavingKey(field);
    setErrors((e) => ({ ...e, [field]: '' }));
    try {
      await updateProfileField(field, value);
      setSession(accessToken, { ...user, [storeKey]: value });
      setSaved((s) => ({ ...s, [field]: true }));
    } catch (err) {
      setErrors((e) => ({
        ...e,
        [field]:
          err instanceof HttpError ? err.message : 'Не удалось сохранить',
      }));
    } finally {
      setSavingKey(null);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Профиль">
      <div className={styles.avatarBlock}>
        <Avatar
          name={user?.full_name ?? user?.username ?? user?.login ?? null}
          src={user?.avatar_url}
          size="lg"
        />
        <span className={styles.login}>@{user?.username ?? user?.login}</span>
      </div>

      <div className={styles.fields}>
        {FIELDS.map(({ key, label, storeKey }) => {
          const changed = values[key].trim() !== (initial[key] ?? '').trim();
          return (
            <div key={key} className={styles.field}>
              <label className={styles.label}>{label}</label>
              <div className={styles.row}>
                <input
                  className={styles.input}
                  value={values[key]}
                  onChange={(e) => {
                    const raw = e.target.value;
                    const next =
                      key === 'username'
                        ? '@' +
                          raw.replace(/^@+/, '').replace(/[^a-zA-Z0-9_]/g, '')
                        : raw;
                    setValues((v) => ({ ...v, [key]: next }));
                    setSaved((s) => ({ ...s, [key]: false }));
                  }}
                  placeholder={label}
                />
                {changed && (
                  <Button
                    size="sm"
                    onClick={() => handleSave(key, storeKey)}
                    isLoading={savingKey === key}
                    disabled={!values[key]?.trim()}
                  >
                    Сохранить
                  </Button>
                )}
              </div>
              {saved[key] && !changed && (
                <span className={styles.savedNote}>Сохранено</span>
              )}
              {errors[key] && (
                <span className={styles.error}>{errors[key]}</span>
              )}
            </div>
          );
        })}
      </div>
    </Modal>
  );
}
