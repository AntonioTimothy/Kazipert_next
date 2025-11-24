import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { FileText, Download, BookOpen, Shield, Globe2, Users, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ResourcesPage() {
  const resourceCategories = [
    {
      title: "Legal Documents",
      icon: FileText,
      gradient: "from-[#117c82] to-[#0d9ea6]",
      resources: [
        { name: "Employment Contract Template", type: "PDF", size: "2.5 MB" },
        { name: "Worker Rights Guide", type: "PDF", size: "1.8 MB" },
        { name: "Visa Application Checklist", type: "PDF", size: "850 KB" },
        { name: "Legal Protection Overview", type: "PDF", size: "1.2 MB" }
      ]
    },
    {
      title: "Training Materials",
      icon: BookOpen,
      gradient: "from-[#FDB913] to-[#f5a623]",
      resources: [
        { name: "Housekeeping Best Practices", type: "PDF", size: "3.2 MB" },
        { name: "Safety Procedures Manual", type: "PDF", size: "2.1 MB" },
        { name: "Communication Guidelines", type: "PDF", size: "1.5 MB" },
        { name: "Cultural Awareness Guide", type: "PDF", size: "2.8 MB" }
      ]
    },
    {
      title: "Country Guides",
      icon: Globe2,
      gradient: "from-[#117c82] to-[#0d9ea6]",
      resources: [
        { name: "Working in Oman Guide", type: "PDF", size: "4.5 MB" },
        { name: "UAE Employment Guide", type: "PDF", size: "3.8 MB" },
        { name: "Qatar Worker Handbook", type: "PDF", size: "3.2 MB" },
        { name: "Saudi Arabia Guide", type: "PDF", size: "4.1 MB" }
      ]
    },
    {
      title: "Support Resources",
      icon: Users,
      gradient: "from-[#FDB913] to-[#f5a623]",
      resources: [
        { name: "Mental Health Resources", type: "PDF", size: "1.9 MB" },
        { name: "Emergency Contacts List", type: "PDF", size: "650 KB" },
        { name: "Family Communication Tips", type: "PDF", size: "1.1 MB" },
        { name: "Financial Planning Guide", type: "PDF", size: "2.3 MB" }
      ]
    }
  ]

  const quickLinks = [
    { title: "FAQs", description: "Frequently asked questions", href: "/faq" },
    { title: "Help Center", description: "Get support and assistance", href: "/help" },
    { title: "Blog", description: "Latest news and updates", href: "/blog" },
    { title: "Community Forum", description: "Connect with other workers", href: "/forum" }
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#117c82] via-[#0d9ea6] to-[#117c82] py-20 md:py-28">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#FDB913]/10 rounded-full blur-3xl animate-pulse" />
          </div>

          <div className="container relative px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center text-white">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 mb-6">
                <BookOpen className="h-4 w-4" />
                <span className="text-sm font-bold">Resources</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
                Everything You Need to Succeed
              </h1>
              <p className="text-xl text-white/90 leading-relaxed">
                Free downloadable guides, templates, and resources to support your journey.
              </p>
            </div>
          </div>
        </section>

        {/* Resource Categories */}
        <section className="py-20 md:py-24 bg-gradient-to-b from-gray-50 to-white">
          <div className="container px-6 lg:px-8">
            <div className="space-y-16 max-w-7xl mx-auto">
              {resourceCategories.map((category, catIndex) => (
                <div key={catIndex} className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className={`h-14 w-14 rounded-xl bg-gradient-to-br ${category.gradient} flex items-center justify-center shadow-lg`}>
                      <category.icon className="h-7 w-7 text-white" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">{category.title}</h2>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {category.resources.map((resource, resIndex) => (
                      <div key={resIndex} className="group bg-white rounded-xl border-2 border-gray-200 hover:border-[#117c82] p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                        <div className="flex items-start justify-between mb-4">
                          <FileText className="h-8 w-8 text-[#117c82]" />
                          <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded">{resource.type}</span>
                        </div>
                        <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2">{resource.name}</h3>
                        <p className="text-sm text-gray-600 mb-4">{resource.size}</p>
                        <Button size="sm" className="w-full bg-gradient-to-r from-[#117c82] to-[#0d9ea6] hover:from-[#0d9ea6] hover:to-[#117c82] text-white">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Quick Links */}
        <section className="py-20 md:py-24 bg-white">
          <div className="container px-6 lg:px-8">
            <div className="text-center mb-12 max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
                More Resources
              </h2>
              <p className="text-lg text-gray-600">
                Explore additional resources and support options
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {quickLinks.map((link, index) => (
                <Link key={index} href={link.href} className="group bg-gradient-to-br from-gray-50 to-white rounded-2xl border-2 border-gray-200 hover:border-[#117c82] p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                  <div className="flex items-start justify-between mb-4">
                    <Shield className="h-8 w-8 text-[#117c82]" />
                    <ExternalLink className="h-5 w-5 text-gray-400 group-hover:text-[#117c82] transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{link.title}</h3>
                  <p className="text-sm text-gray-600">{link.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
