// components/store-initializer.tsx
'use client';

import { useEffect } from 'react';
import { initializeStore } from '@/stores';

export const StoreInitializer: React.FC = () => {
  useEffect(() => {
    // Initialize store when app starts
    initializeStore().catch(console.error);
  }, []);

  return null; // This component doesn't render anything
};