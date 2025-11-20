// app/layout.tsx
import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Suspense } from "react"
import { LiveChatWidget } from "@/components/live-chat-widget"
import { ThemeProvider } from "@/contexts/ThemeContext"
import { ThemeInitializer } from '@/components/ThemeInitializer'
import { GlobalLoader } from '@/components/global-loader'
import { SuspenseLoader } from '@/components/suspense-loader'
import { StoreInitializer } from '@/components/store-initializer'
import RegisterSW from "@/components/register-sw";
import PWAInstallPrompt from "@/components/pwa-install";

export const metadata: Metadata = {
  title: "Kazipert - Connecting Kenyan Workers with Gulf Employers",
  description: "Digital recruitment ecosystem connecting domestic workers from Kenya with employers in Oman and the Gulf region. Safe, transparent, and compliant.",
  generator: "v0.app",
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <head>
      <link rel="manifest" href="/manifest.json" />
          <meta name="theme-color" content="#0EA5A8" />

          {/* iOS splash screen support */}
          <link rel="apple-touch-icon" href="/logo.png" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="default" />
          <meta name="apple-mobile-web-app-title" content="Kazipert" />
      </head>
      <body className="font-sans antialiased">

        <ThemeProvider>
          <ThemeInitializer />
          
          {/* Initialize store on app start */}
          <StoreInitializer />
          
          {/* Global Loading Spinner for API calls & manual loading using Zustand */}
          <GlobalLoader />
          
          {/* Main Content with Suspense for page loading */}
          <Suspense fallback={<SuspenseLoader />}>
            {children}
          </Suspense>
          
          {/* <LiveChatWidget /> */}
        </ThemeProvider>
        <RegisterSW />
        <PWAInstallPrompt />
        <Analytics />
        

      </body>
    </html>
  )
}