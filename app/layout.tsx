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
import { LoadingProvider } from '@/contexts/loading-context'
import { GlobalLoader } from '@/components/global-loader'

export const metadata: Metadata = {
  title: "Kazipert - Connecting Kenyan Workers with Gulf Employers",
  description:
    "Digital recruitment ecosystem connecting domestic workers from Kenya with employers in Oman and the Gulf region. Safe, transparent, and compliant.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="font-sans antialiased">
        <LoadingProvider>
          <ThemeProvider>
            <ThemeInitializer />
            
            {/* Global Loading Spinner wrapped in Suspense */}
            <Suspense fallback={<div>Loading...</div>}>
              <GlobalLoader />
            </Suspense>
            
            {/* Main Content */}
            {children}
            
            {/* <LiveChatWidget /> */}
          </ThemeProvider>
        </LoadingProvider>

        <Analytics />
      </body>
    </html>
  )
}