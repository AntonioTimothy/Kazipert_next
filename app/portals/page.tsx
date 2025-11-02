// app/portals/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePortalUser } from "./layout";

export default function PortalsPage() {
  const router = useRouter();
  const { user } = usePortalUser();

  useEffect(() => {
    // Auto-redirect based on user role to their dashboard
    switch (user.role) {
      case 'EMPLOYEE':
        router.push('/portals/worker/dashboard');
        break;
      case 'EMPLOYER':
        router.push('/portals/employer/dashboard');
        break;
      case 'ADMIN':
      case 'SUPER_ADMIN':
      case 'HOSPITAL_ADMIN':
      case 'PHOTO_STUDIO_ADMIN':
      case 'EMBASSY_ADMIN':
        router.push('/portals/admin/dashboard');
        break;
      default:
        router.push('/');
    }
  }, [user.role, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirecting to your dashboard...</p>
      </div>
    </div>
  );
}