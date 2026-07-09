import { useState, useRef, useEffect } from 'react';
import { Modal, Avatar, Button } from '@/components';
import { TrashIcon, EditIcon } from '@/components/icons';
import {
  updateProfileField,
  uploadAvatar,
  deleteAvatar,
} from '@/api/profileApi';
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
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarError, setAvatarError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const wasOpenRef = useRef(false);

  // Сбрасываем форму ТОЛЬКО в момент открытия модалки (false → true),
  // а не на каждое изменение user — иначе сохранение поля затирает состояние
  useEffect(() => {
    if (isOpen && !wasOpenRef.current) {
      wasOpenRef.current = true;
      setValues({
        username: user?.username ? `@${user.username.replace(/^@/, '')}` : '',
        fullname: user?.full_name ?? '',
        about: user?.about ?? '',
      });
      setErrors({});
      setSaved({});
      setAvatarError('');
    }
    if (!isOpen) {
      wasOpenRef.current = false;
    }
  }, [isOpen, user]);

  // При открытии модалки синхронизируем поля с актуальными данными
  // и сбрасываем ошибки/статусы, чтобы не оставалось введённого с прошлого раза
  useEffect(() => {
    if (isOpen) {
      setValues({
        username: user?.username ? `@${user.username.replace(/^@/, '')}` : '',
        fullname: user?.full_name ?? '',
        about: user?.about ?? '',
      });
      setErrors({});
      setSaved({});
      setAvatarError('');
    }
  }, [isOpen, user]);

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || !user || !accessToken) return;

    if (!file.type.startsWith('image/')) {
      setAvatarError('Нужен файл изображения');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setAvatarError('Максимум 5 МБ');
      return;
    }

    setAvatarUploading(true);
    setAvatarError('');
    try {
      const res = await uploadAvatar(file, accessToken);
      if (res.avatar_url) {
        setSession(accessToken, { ...user, avatar_url: res.avatar_url });
      }
    } catch (err) {
      setAvatarError(
        err instanceof Error ? err.message : 'Не удалось загрузить',
      );
    } finally {
      setAvatarUploading(false);
    }
  }

  async function handleDeleteAvatar() {
    if (!user || !accessToken || !user.avatar_url) return;
    setAvatarUploading(true);
    setAvatarError('');
    try {
      await deleteAvatar();
      setSession(accessToken, { ...user, avatar_url: null });
    } catch (err) {
      setAvatarError(err instanceof Error ? err.message : 'Не удалось удалить');
    } finally {
      setAvatarUploading(false);
    }
  }

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
        <div className={styles.avatarRow}>
          <button
            className={`${styles.iconBtn} ${styles.deleteBtn}`}
            onClick={handleDeleteAvatar}
            disabled={avatarUploading || !user?.avatar_url}
            aria-label="Удалить фото"
            title="Удалить фото"
          >
            <TrashIcon width={20} height={20} />
          </button>

          <Avatar
            name={user?.full_name ?? user?.username ?? user?.login ?? null}
            src={user?.avatar_url}
            size="xl"
          />

          <button
            className={styles.iconBtn}
            onClick={() => fileInputRef.current?.click()}
            disabled={avatarUploading}
            aria-label="Изменить фото"
            title="Изменить фото"
          >
            <EditIcon width={20} height={20} />
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={handleAvatarChange}
        />
        <span className={styles.login}>@{user?.username ?? user?.login}</span>
        {avatarError && <span className={styles.error}>{avatarError}</span>}
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
