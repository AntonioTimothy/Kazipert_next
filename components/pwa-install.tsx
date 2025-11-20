"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function PWAInstallPrompt() {
  const pathname = usePathname();
  const [promptEvent, setPromptEvent] = useState<any>(null);
  const [showButton, setShowButton] = useState(false);

  // Listen for browser prompt
  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setPromptEvent(e);

      // Show install button ONLY on /portals
      if (pathname.startsWith("/portals")) {
        setShowButton(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, [pathname]);

  async function installPWA() {
    if (!promptEvent) return;

    promptEvent.prompt();
    const choice = await promptEvent.userChoice;

    setPromptEvent(null);
    setShowButton(false);
  }

  if (!showButton) return null;

  return (
    <button
      onClick={installPWA}
      className="fixed bottom-5 right-5 px-4 py-3 bg-teal-600 text-white rounded-xl shadow-lg z-50"
    >
      Install Kazipert App
    </button>
  );
}
