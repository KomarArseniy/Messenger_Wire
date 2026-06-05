import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { useId, useState } from 'react';
import { EyeIcon, EyeOffIcon } from '@/components/icons';
import styles from './AuthInput.module.scss';

interface AuthInputProps extends ComponentPropsWithoutRef<'input'> {
  label: string;
  icon: ReactNode;
  error?: string;
  isPassword?: boolean;
}

export function AuthInput({
  label,
  icon,
  error,
  isPassword = false,
  id,
  type,
  ...rest
}: AuthInputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const [visible, setVisible] = useState(false);

  const inputType = isPassword ? (visible ? 'text' : 'password') : type;

  return (
    <div className={styles.field}>
      <div className={styles.wrapper}>
        <span className={styles.icon}>{icon}</span>
        <input
          id={inputId}
          type={inputType}
          placeholder=" "
          className={`${styles.input} ${error ? styles.hasError : ''}`}
          {...rest}
        />
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
        {isPassword && (
          <button
            type="button"
            className={styles.eye}
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? 'Скрыть пароль' : 'Показать пароль'}
            tabIndex={-1}
          >
            {visible ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        )}
      </div>
      <span className={styles.error}>{error ?? ''}</span>
    </div>
  );
}
