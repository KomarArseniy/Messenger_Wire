import type { ComponentPropsWithoutRef, Ref } from 'react';
import { useId } from 'react';
import styles from './Input.module.scss';

interface InputProps extends ComponentPropsWithoutRef<'input'> {
  label?: string;
  error?: string;
  ref?: Ref<HTMLInputElement>;
}

export function Input({
  label,
  error,
  id,
  className,
  ref,
  ...rest
}: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  const inputClasses = [styles.input, error && styles.hasError, className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={styles.wrapper}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
      )}
      <input id={inputId} className={inputClasses} ref={ref} {...rest} />
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
}
