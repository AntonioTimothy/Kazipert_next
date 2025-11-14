// components/global-loader.tsx - UPDATED WITH INDIVIDUAL HOOK
'use client';

import { useIsLoading } from '@/stores'; // Import individual hook
import styles from './GlobalLoader.module.css';

export const GlobalLoader: React.FC = () => {
  const isLoading = useIsLoading(); // Use individual hook

  if (!isLoading) return null;

  return (
    <div className={styles.container} data-testid="global-loader">
      <div className={styles.triangle}></div>
      {/* <p className={styles.loadingText}>...</p> */}
    </div>
  );
};