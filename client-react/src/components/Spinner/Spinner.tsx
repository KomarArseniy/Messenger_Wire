import styles from './Spinner.module.scss';

type SpinnerSize = 'sm' | 'md' | 'lg';

interface SpinnerProps {
  size?: SpinnerSize;
}

export function Spinner({ size = 'md' }: SpinnerProps) {
  return (
    <span
      className={`${styles.spinner} ${styles[size]}`}
      role="status"
      aria-label="Загрузка"
    />
  );
}
