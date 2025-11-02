// app/portals/layout.tsx - UPDATED VERSION
"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { LoadingSpinner } from "@/components/loading-spinner";
import { PortalLayout } from "@/components/portal-layout";
import { createContext, useContext } from 'react';

const PortalUserContext = createContext<{ user: any } | null>(null);

export function usePortalUser() {
  const context = useContext(PortalUserContext);
  if (!context) {
    throw new Error('usePortalUser must be used within a PortalUserProvider');
  }
  return context;
}

function PortalUserProvider({ 
  user, 
  children 
}: { 
  user: any; 
  children: React.ReactNode 
}) {
  return (
    <PortalUserContext.Provider value={{ user }}>
      {children}
    </PortalUserContext.Provider>
  );
}

interface RootPortalLayoutProps {
  children: React.ReactNode;
}

export default function RootPortalLayout({ children }: RootPortalLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, [pathname]);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/me', {
        credentials: 'include', // IMPORTANT: Include cookies
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await res.json();
      
      if (data.user) {
        console.log('Auth check successful:', data.user.email);
        setUser(data.user);
        
        // Check if user has access to current portal
        if (!hasPortalAccess(data.user.role, pathname)) {
          console.log('Access denied for role:', data.user.role, 'to path:', pathname);
          router.push('/unauthorized');
          return;
        }
      } else {
        console.log('No user found, redirecting to login');
        // Redirect to login with return URL
        const loginUrl = new URL('/login', window.location.origin);
        loginUrl.searchParams.set('redirect', pathname);
        router.push(loginUrl.toString());
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const hasPortalAccess = (userRole: string, currentPath: string): boolean => {
    if (currentPath.startsWith('/portals/worker') && userRole !== 'EMPLOYEE') {
      return false;
    }
    if (currentPath.startsWith('/portals/employer') && userRole !== 'EMPLOYER') {
      return false;
    }
    if (currentPath.startsWith('/portals/admin') && !['ADMIN', 'SUPER_ADMIN', 'HOSPITAL_ADMIN', 'PHOTO_STUDIO_ADMIN', 'EMBASSY_ADMIN'].includes(userRole)) {
      return false;
    }
    return true;
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return null;
  }

  return (
    <PortalUserProvider user={user}>
      <PortalLayout user={user}>
        {children}
      </PortalLayout>
    </PortalUserProvider>
  );
}