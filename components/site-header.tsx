"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu, X, Globe } from "lucide-react"
import { useState, useEffect } from "react"
import { FeaturesModal } from "@/components/features-modal"
import { cn } from "@/lib/utils"

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [featuresModalOpen, setFeaturesModalOpen] = useState(false)
  const [language, setLanguage] = useState("EN")
  const [scrolled, setScrolled] = useState(false)

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

  const NavLink = ({ href, children, onClick = () => {} }) => (
    <Link
      href={href}
      onClick={onClick}
      className="group relative text-base font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground"
    >
      {children}
      <span className="absolute -bottom-1.5 left-0 h-[2px] w-0 bg-accent transition-all duration-200 ease-out group-hover:w-full" />
    </Link>
  )

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-200",
          scrolled
            ? "border-b border-border/30 bg-background/80 backdrop-blur-lg shadow-sm"
            : "bg-background/0"
        )}
      >
        <div className="container flex h-20 items-center justify-between">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center gap-3 group transition-opacity hover:opacity-90"
          >
            <Image
              src="/logo.svg"
              alt="Kazipert"
              width={200}
              height={200}
              className="transition-transform duration-200 group-hover:scale-105"
              priority
            />
            
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-8 md:flex">
            <NavLink href="/about">About</NavLink>
            <NavLink href="/training">Training</NavLink>
            <button
              onClick={() => setFeaturesModalOpen(true)}
              className="group relative text-base font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground"
            >
              Features
              <span className="absolute -bottom-1.5 left-0 h-[2px] w-0 bg-accent transition-all duration-200 ease-out group-hover:w-full" />
            </button>
            <NavLink href="/videos">Videos</NavLink>
            <NavLink href="/resources">Resources</NavLink>
            <NavLink href="/contact">Contact</NavLink>
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-6">
            {/* Language Switcher */}
            <div className="relative group hidden md:block">
              <button className="flex items-center gap-2 px-3 py-2 text-base font-medium rounded-md
                text-muted-foreground hover:text-foreground transition-colors hover:bg-accent/10">
                <Globe className="h-4 w-4" />
                <span>{language}</span>
              </button>
              <div className="absolute right-0 mt-1 w-40 rounded-xl border bg-background/95 backdrop-blur-sm
                p-1 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible
                transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={cn(
                      "w-full px-4 py-2.5 text-left text-sm rounded-lg transition-colors",
                      "hover:bg-accent/10",
                      language === lang.code 
                        ? "font-semibold text-foreground bg-accent/5" 
                        : "text-muted-foreground"
                    )}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                asChild 
                className="hidden md:inline-flex hover:bg-accent/10 transition-colors text-base"
              >
                <Link href="/login">Sign In</Link>
              </Button>
              <Button 
                asChild 
                className="bg-accent hover:bg-accent/90 text-white shadow-lg hover:shadow-xl
                transition-all duration-200 transform hover:-translate-y-0.5 text-base px-6"
              >
                <Link href="/signup">Get Started</Link>
              </Button>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden hover:bg-accent/10"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div 
          className={cn(
            "fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity duration-200 md:hidden",
            mobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
          )}
        >
          <div 
            className={cn(
              "fixed inset-y-0 right-0 w-full max-w-sm bg-background p-6 shadow-2xl transform transition-transform duration-300 ease-in-out",
              mobileMenuOpen ? "translate-x-0" : "translate-x-full"
            )}
          >
            <nav className="flex flex-col gap-6 pt-4">
              <NavLink href="/about" onClick={() => setMobileMenuOpen(false)}>About</NavLink>
              <NavLink href="/training" onClick={() => setMobileMenuOpen(false)}>Training</NavLink>
              <button
                onClick={() => {
                  setFeaturesModalOpen(true)
                  setMobileMenuOpen(false)
                }}
                className="text-left text-base font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Features
              </button>
              <NavLink href="/videos" onClick={() => setMobileMenuOpen(false)}>Videos</NavLink>
              <NavLink href="/resources" onClick={() => setMobileMenuOpen(false)}>Resources</NavLink>
              <NavLink href="/contact" onClick={() => setMobileMenuOpen(false)}>Contact</NavLink>

              {/* Language Switcher Mobile */}
              <div className="mt-6 border-t pt-6">
                <p className="mb-3 text-sm font-medium text-muted-foreground">Select Language</p>
                <div className="grid gap-2">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code)
                        setMobileMenuOpen(false)
                      }}
                      className={cn(
                        "px-4 py-3 rounded-lg text-base transition-colors",
                        language === lang.code 
                          ? "bg-accent/20 font-semibold text-foreground" 
                          : "hover:bg-accent/10 text-muted-foreground"
                      )}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              </div>
            </nav>
          </div>
        </div>
      </header>

      <FeaturesModal open={featuresModalOpen} onOpenChange={setFeaturesModalOpen} />
    </>
  )
}
