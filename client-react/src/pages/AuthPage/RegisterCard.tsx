import type { FormEvent } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthInput } from '@/components/AuthInput';
import { UserIcon, MailIcon, LockIcon, BackIcon } from '@/components/icons';
import { register } from '@/api/authApi';
import { setFallbackToken, HttpError } from '@/lib/httpClient';
import {
  validateLogin,
  validateEmail,
  validatePassword,
} from '@/lib/validation';
import styles from './AuthPage.module.scss';

interface RegisterCardProps {
  onSwitchToLogin: () => void;
}

export function RegisterCard({ onSwitchToLogin }: RegisterCardProps) {
  const navigate = useNavigate();

  const [loginValue, setLoginValue] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<{
    login?: string;
    email?: string;
    password?: string;
    confirm?: string;
  }>({});
  const [formError, setFormError] = useState('');
  const [isSubmitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError('');

    const loginError = validateLogin(loginValue);
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    const confirmError = password !== confirm ? 'Пароли не совпадают' : null;

    if (loginError || emailError || passwordError || confirmError) {
      setErrors({
        login: loginError ?? undefined,
        email: emailError ?? undefined,
        password: passwordError ?? undefined,
        confirm: confirmError ?? undefined,
      });
      return;
    }

    setErrors({});
    setSubmitting(true);
    try {
      const res = await register({
        login: loginValue.trim(),
        email: email.trim(),
        password,
      });
      setFallbackToken(res.accessToken);
      navigate('/chat');
    } catch (err) {
      setFormError(
        err instanceof HttpError
          ? err.message
          : 'Не удалось зарегистрироваться',
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={styles.card}>
      <button
        type="button"
        className={styles.backBtn}
        onClick={onSwitchToLogin}
        aria-label="Назад ко входу"
      >
        <BackIcon />
      </button>
      <h1 className={styles.title}>Регистрация</h1>

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
          label="Email"
          icon={<MailIcon />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          autoComplete="email"
        />
        <AuthInput
          label="Пароль"
          icon={<LockIcon />}
          isPassword
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          autoComplete="new-password"
        />
        <AuthInput
          label="Повтор пароля"
          icon={<LockIcon />}
          isPassword
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          error={errors.confirm}
          autoComplete="new-password"
        />

        <p className={styles.formError}>{formError}</p>

        <button
          type="submit"
          className={`${styles.btn} ${styles.primaryBtn}`}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Регистрация…' : 'Зарегистрироваться'}
        </button>
      </form>

      <button
        type="button"
        className={`${styles.btn} ${styles.secondaryBtn}`}
        onClick={onSwitchToLogin}
      >
        У меня уже есть аккаунт
      </button>
    </div>
  );
}
