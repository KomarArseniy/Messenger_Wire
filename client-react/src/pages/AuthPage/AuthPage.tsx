import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginCard } from './LoginCard';
import { RegisterCard } from './RegisterCard';
import { useCursorGlow } from '@/hooks/useCursorGlow';
import styles from './AuthPage.module.scss';

interface AuthPageProps {
  initialCard?: 'login' | 'register';
}

export function AuthPage({ initialCard = 'login' }: AuthPageProps) {
  const navigate = useNavigate();
  const [card, setCard] = useState<'login' | 'register'>(initialCard);
  const pageRef = useCursorGlow<HTMLDivElement>();

  function showRegister() {
    setCard('register');
    navigate('/register', { replace: true });
  }

  function showLogin() {
    setCard('login');
    navigate('/login', { replace: true });
  }

  return (
    <div className={styles.page} ref={pageRef}>
      <div className={styles.blobs} aria-hidden="true">
        <span className={styles.blob1} />
        <span className={styles.blob2} />
        <span className={styles.blob3} />
        <span className={styles.blob4} />
        <span className={styles.blob5} />
      </div>

      <div className={styles.glow} aria-hidden="true" />

      <div className={styles.watermark} aria-hidden="true">
        WIRE
      </div>

      <div className={styles.container}>
        <div
          key={card}
          className={
            card === 'login' ? styles.slideFromLeft : styles.slideFromRight
          }
        >
          {card === 'login' ? (
            <LoginCard onSwitchToRegister={showRegister} />
          ) : (
            <RegisterCard onSwitchToLogin={showLogin} />
          )}
        </div>
      </div>
    </div>
  );
}
