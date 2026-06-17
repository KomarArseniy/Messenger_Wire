import { useState } from 'react';
import { getInitials, getColorFromName } from '@/lib/avatar';
import { API_BASE_URL } from '@/lib/config';
import styles from './Avatar.module.scss';

type AvatarSize = 'sm' | 'md' | 'lg';

interface AvatarProps {
  name: string | null;
  src?: string | null;
  size?: AvatarSize;
}

export function Avatar({ name, src, size = 'md' }: AvatarProps) {
  const [failed, setFailed] = useState(false);

  const showImage = src && !failed;
  const fullSrc = src?.startsWith('http')
    ? src
    : `${API_BASE_URL}/${src?.replace(/^\//, '')}`;

  const className = `${styles.avatar} ${styles[size]}`;

  if (showImage) {
    return (
      <img
        className={className}
        src={fullSrc}
        alt={name ?? 'Аватар'}
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <div
      className={className}
      style={{ backgroundColor: getColorFromName(name) }}
    >
      {getInitials(name)}
    </div>
  );
}
