import type { FormEvent } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthInput } from '@/components/AuthInput';
import { UserIcon, LockIcon } from '@/components/icons';
import { login } from '@/api/authApi';
import { HttpError } from '@/lib/httpClient';
import { useSessionStore } from '@/store/sessionStore';
import { validateLogin } from '@/lib/validation';
import styles from './AuthPage.module.scss';

interface LoginCardProps {
  onSwitchToRegister: () => void;
}

export function LoginCard({ onSwitchToRegister }: LoginCardProps) {
  const navigate = useNavigate();

  const [loginValue, setLoginValue] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ login?: string; password?: string }>(
    {},
  );
  const [formError, setFormError] = useState('');
  const [isSubmitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError('');

    const loginError = validateLogin(loginValue);
    const passwordError = password ? null : 'Пожалуйста, заполните это поле';
    if (loginError || passwordError) {
      setErrors({
        login: loginError ?? undefined,
        password: passwordError ?? undefined,
      });
      return;
    }

    setErrors({});
    setSubmitting(true);
    try {
      const res = await login({ login: loginValue.trim(), password });
      useSessionStore.getState().setSession(res.accessToken, res.user);
      navigate('/chat');
    } catch (err) {
      setFormError(
        err instanceof HttpError ? err.message : 'Не удалось выполнить вход',
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={styles.card}>
      <h1 className={styles.title}>Вход</h1>

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <AuthInput
          label="Логин"
          icon={<UserIcon />}
          value={loginValue}
          onChange={(e) => setLoginValue(e.target.value)}
          error={errors.login}
          autoComplete="username"
        />
        <AuthInput
          label="Пароль"
          icon={<LockIcon />}
          isPassword
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          autoComplete="current-password"
        />

        <p className={styles.formError}>{formError}</p>

        <button
          type="submit"
          className={`${styles.btn} ${styles.primaryBtn}`}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Вход…' : 'Войти'}
        </button>
      </form>

      <button
        type="button"
        className={`${styles.btn} ${styles.secondaryBtn}`}
        onClick={onSwitchToRegister}
      >
        Создать аккаунт
      </button>
    </div>
  );
}
