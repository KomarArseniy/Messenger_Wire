export type ValidationError = string | null;

export function validateLogin(value: string): ValidationError {
  const trimmed = value.trim();
  if (!trimmed) return 'Пожалуйста, заполните это поле';
  if (trimmed.length < 3) return 'Минимум символов — 3';
  if (trimmed.length > 15) return 'Ограничение символов — 15';
  return null;
}

export function validateEmail(value: string): ValidationError {
  const trimmed = value.trim();
  if (!trimmed) return 'Пожалуйста, заполните это поле';
  if (trimmed.length > 30) return 'Ограничение символов — 30';
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(trimmed)) return 'Некорректный email';
  return null;
}

export function validatePassword(value: string): ValidationError {
  if (!value) return 'Пожалуйста, заполните это поле';
  if (value.length < 8) return 'Минимум символов — 8';
  if (value.length > 16) return 'Ограничение символов — 16';
  if (!/[a-z]/.test(value) || !/[A-Z]/.test(value)) {
    return 'Нужны заглавная и строчная латинские буквы';
  }
  return null;
}
