"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu, X, Globe } from "lucide-react"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { FeaturesModal } from "@/components/features-modal"
import { cn } from "@/lib/utils"

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [featuresModalOpen, setFeaturesModalOpen] = useState(false)
  const [language, setLanguage] = useState("EN")
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const languages = [
    { code: "EN", label: "English" },
    { code: "AR", label: "العربية" },
    { code: "SW", label: "Swahili" },
  ]

  const NavLink = ({ href, children, onClick = () => { } }: { href: string; children: React.ReactNode; onClick?: () => void }) => {
    const isActive = pathname === href

    return (
      <Link
        href={href}
        onClick={onClick}
        className={cn(
          "group relative text-sm font-semibold transition-colors duration-200",
          isActive ? "text-[#117c82]" : "text-gray-700 hover:text-[#117c82]"
        )}
      >
        {children}
        {/* Yellow upward-pointing triangle for active state */}
        {isActive && (
          <span
            className="absolute -bottom-[22px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[10px] border-b-[#FDB913]"
          />
        )}
      </Link>
    )
  }

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-200 bg-white shadow-sm"
        )}
      >
        <div className="container flex h-16 items-center justify-between px-6 lg:px-8">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 group transition-opacity hover:opacity-90"
          >
            <Image
              src="/logo.svg"
              alt="Kazipert"
              width={160}
              height={160}
              className="transition-transform duration-200 group-hover:scale-105"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-8 md:flex">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/about">About</NavLink>
            <NavLink href="/training">Training</NavLink>
           
            <NavLink href="/videos">Videos</NavLink>
            <NavLink href="/resources">Resources</NavLink>
            <NavLink href="/contact">Contact Us</NavLink>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            {/* Language Selector */}
            <div className="hidden lg:flex items-center gap-2">
              <Globe className="h-4 w-4 text-gray-600" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="text-sm font-medium text-gray-700 bg-transparent border-none focus:outline-none cursor-pointer"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.code}
                  </option>
                ))}
              </select>
            </div>

            {/* Get Started Button - Yellow Background */}
            <Button
              size="sm"
              asChild
              className="bg-[#FDB913] hover:bg-[#FDB913]/90 text-black font-bold text-sm px-6 shadow-md hover:shadow-lg transition-all"
            >
              <Link href="/signup">Get Started</Link>
            </Button>

            {/* Login Button - Green Outline */}
            <Button
              variant="outline"
              size="sm"
              asChild
              className="hidden md:inline-flex border-2 border-[#117c82] text-[#117c82] hover:bg-[#117c82]/5 font-semibold text-sm px-6"
            >
              <Link href="/login">Login</Link>
            </Button>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-gray-700 hover:text-[#117c82] transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Yellow Line Below Header */}
        <div className="w-full h-1 bg-gradient-to-r from-[#FDB913] via-[#FDB913] to-[#117c82]" />

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg z-50 md:hidden">
              <nav className="container flex flex-col gap-4 py-6 px-4">
                <NavLink href="/" onClick={() => setMobileMenuOpen(false)}>Home</NavLink>
                <NavLink href="/about" onClick={() => setMobileMenuOpen(false)}>About</NavLink>
                <NavLink href="/training" onClick={() => setMobileMenuOpen(false)}>Training</NavLink>
                
                <NavLink href="/videos" onClick={() => setMobileMenuOpen(false)}>Videos</NavLink>
                <NavLink href="/resources" onClick={() => setMobileMenuOpen(false)}>Resources</NavLink>
                <NavLink href="/contact" onClick={() => setMobileMenuOpen(false)}>Contact Us</NavLink>
                <div className="pt-4 border-t border-gray-200 flex flex-col gap-3">
                  <Button
                    size="sm"
                    asChild
                    className="w-full bg-[#FDB913] hover:bg-[#FDB913]/90 text-black font-bold"
                  >
                    <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>Get Started</Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="w-full border-2 border-[#117c82] text-[#117c82] font-semibold"
                  >
                    <Link href="/login" onClick={() => setMobileMenuOpen(false)}>Login</Link>
                  </Button>
                </div>
              </nav>
            </div>
          </>
        )}
      </header>

      <FeaturesModal open={featuresModalOpen} onOpenChange={setFeaturesModalOpen} />
    </>
  )
}
