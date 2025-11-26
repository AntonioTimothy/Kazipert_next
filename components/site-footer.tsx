import Link from "next/link"
import Image from "next/image"
import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-gradient-to-b from-white to-[#117c82]/5 px-4 md:px-8">
      <div className="container py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Company Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/logo.svg"
                alt="Kazipert"
                width={150}
                height={150}
                className="transition-transform duration-200 hover:scale-105"
              />
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Connecting Kenyan workers with Gulf employers through a safe, transparent, and compliant digital ecosystem.
            </p>
            <div className="flex gap-3">
              <Link
                href="#"
                className="h-9 w-9 rounded-full bg-[#117c82]/10 flex items-center justify-center text-[#117c82] transition-all hover:bg-[#117c82] hover:text-white"
              >
                <Facebook className="h-4 w-4" />
              </Link>
              <Link
                href="#"
                className="h-9 w-9 rounded-full bg-[#117c82]/10 flex items-center justify-center text-[#117c82] transition-all hover:bg-[#117c82] hover:text-white"
              >
                <Twitter className="h-4 w-4" />
              </Link>
              <Link
                href="#"
                className="h-9 w-9 rounded-full bg-[#117c82]/10 flex items-center justify-center text-[#117c82] transition-all hover:bg-[#117c82] hover:text-white"
              >
                <Linkedin className="h-4 w-4" />
              </Link>
              <Link
                href="#"
                className="h-9 w-9 rounded-full bg-[#117c82]/10 flex items-center justify-center text-[#117c82] transition-all hover:bg-[#117c82] hover:text-white"
              >
                <Instagram className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-[#117c82]">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground transition-colors hover:text-[#117c82]">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/training" className="text-muted-foreground transition-colors hover:text-[#117c82]">
                  Training Videos
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-muted-foreground transition-colors hover:text-[#117c82]">
                  Our Services
                </Link>
              </li>
              <li>
                <Link href="/resources" className="text-muted-foreground transition-colors hover:text-[#117c82]">
                  Resources
                </Link>
              </li>
            </ul>
          </div>

          {/* For Workers & Employers */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-[#117c82]">Portals</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/portals/worker"
                  className="text-muted-foreground transition-colors hover:text-[#117c82]"
                >
                  Worker Portal
                </Link>
              </li>
              <li>
                <Link
                  href="/portals/employer"
                  className="text-muted-foreground transition-colors hover:text-[#117c82]"
                >
                  Employer Portal
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-muted-foreground transition-colors hover:text-[#117c82]">
                  Integrated Services
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground transition-colors hover:text-[#117c82]">
                  Help & Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-[#117c82]">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-[#117c82]" />
                <span>Nairobi, Kenya & Muscat, Oman</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4 flex-shrink-0 text-[#117c82]" />
                <span>+254 700 000 000</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4 flex-shrink-0 text-[#117c82]" />
                <span>info@kazipert.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-muted-foreground">© 2025 Kazipert. All rights reserved.</p>
            <div className="flex gap-6 text-sm">
              <Link href="/privacy" className="text-muted-foreground transition-colors hover:text-[#117c82]">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-muted-foreground transition-colors hover:text-[#117c82]">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-muted-foreground transition-colors hover:text-[#117c82]">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
