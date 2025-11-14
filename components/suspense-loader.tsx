// components/suspense-loader.tsx
import styles from './GlobalLoader.module.css';

export const SuspenseLoader: React.FC = () => {
  return (
    <div className={styles.container} data-testid="suspense-loader">
      <div className={styles.triangle}></div>
      <p className={styles.loadingText}>Loading Page...</p>
    </div>
  );
};