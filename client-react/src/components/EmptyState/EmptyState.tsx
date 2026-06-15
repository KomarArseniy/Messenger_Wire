import { useLottie } from 'lottie-react';
import styles from './EmptyState.module.scss';

interface EmptyStateProps {
  animation: object;
  title?: string;
  subtitle?: string;
  size?: number;
  titleColor?: string;
}

export function EmptyState({
  animation,
  title,
  subtitle,
  size = 200,
  titleColor,
}: EmptyStateProps) {
  const { View } = useLottie({
    animationData: animation,
    loop: true,
    autoplay: true,
  });

  return (
    <div className={styles.wrapper}>
      <div style={{ width: size, height: size }}>{View}</div>
      {title && (
        <p
          className={styles.title}
          style={titleColor ? { color: titleColor } : undefined}
        >
          {title}
        </p>
      )}
      {subtitle && (
        <p
          className={styles.subtitle}
          style={titleColor ? { color: titleColor } : undefined}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
