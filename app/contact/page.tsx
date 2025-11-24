import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Mail, Phone, MapPin, Clock, Send, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function ContactPage() {
  const contactMethods = [
    {
      icon: Mail,
      title: "Email Us",
      details: "info@kazipert.com",
      description: "We'll respond within 24 hours",
      gradient: "from-[#117c82] to-[#0d9ea6]"
    },
    {
      icon: Phone,
      title: "Call Us",
      details: "+254 700 000 000",
      description: "Mon-Fri, 8AM-6PM EAT",
      gradient: "from-[#FDB913] to-[#f5a623]"
    },
    {
      icon: MapPin,
      title: "Visit Us",
      details: "Nairobi, Kenya",
      description: "Main office location",
      gradient: "from-[#117c82] to-[#0d9ea6]"
    },
    {
      icon: Clock,
      title: "24/7 Support",
      details: "Always Available",
      description: "Emergency hotline active",
      gradient: "from-[#FDB913] to-[#f5a623]"
    }
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#117c82] via-[#0d9ea6] to-[#117c82] py-20 md:py-28">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-0 w-96 h-96 bg-[#FDB913]/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
          </div>

          <div className="container relative px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center text-white">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 mb-6">
                <MessageSquare className="h-4 w-4" />
                <span className="text-sm font-bold">Contact Us</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
                We're Here to Help
              </h1>
              <p className="text-xl text-white/90 leading-relaxed">
                Have questions? Get in touch with our team and we'll respond as soon as possible.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Methods */}
        <section className="py-20 md:py-24 bg-gradient-to-b from-gray-50 to-white">
          <div className="container px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto mb-20">
              {contactMethods.map((method, index) => (
                <div key={index} className="group relative bg-white rounded-2xl border-2 border-gray-200 hover:border-transparent p-8 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                  <div className={`absolute inset-0 bg-gradient-to-br ${method.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl -z-10`} />
                  <div className="absolute inset-[2px] bg-white rounded-2xl -z-10" />

                  <div className="relative text-center space-y-4">
                    <div className={`h-16 w-16 rounded-xl bg-gradient-to-br ${method.gradient} flex items-center justify-center mx-auto transition-transform duration-300 group-hover:scale-110 shadow-lg`}>
                      <method.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{method.title}</h3>
                    <p className="text-lg font-semibold text-[#117c82]">{method.details}</p>
                    <p className="text-sm text-gray-600">{method.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Contact Form */}
            <div className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
              <div className="space-y-6">
                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
                  Send Us a Message
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Fill out the form and our team will get back to you within 24 hours.
                </p>

                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">First Name</label>
                      <Input placeholder="John" className="h-12" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">Last Name</label>
                      <Input placeholder="Doe" className="h-12" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Email</label>
                    <Input type="email" placeholder="john@example.com" className="h-12" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Phone Number</label>
                    <Input type="tel" placeholder="+254 700 000 000" className="h-12" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Subject</label>
                    <Input placeholder="How can we help?" className="h-12" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Message</label>
                    <Textarea placeholder="Tell us more about your inquiry..." rows={6} />
                  </div>

                  <Button size="lg" className="w-full bg-gradient-to-r from-[#117c82] to-[#0d9ea6] hover:from-[#0d9ea6] hover:to-[#117c82] text-white font-bold shadow-xl">
                    <Send className="h-5 w-5 mr-2" />
                    Send Message
                  </Button>
                </form>
              </div>

              <div className="space-y-8">
                <div className="bg-gradient-to-br from-[#117c82] to-[#0d9ea6] rounded-2xl p-8 text-white">
                  <h3 className="text-2xl font-bold mb-4">Office Hours</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Monday - Friday</span>
                      <span className="font-semibold">8:00 AM - 6:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Saturday</span>
                      <span className="font-semibold">9:00 AM - 2:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sunday</span>
                      <span className="font-semibold">Closed</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-[#FDB913] to-[#f5a623] rounded-2xl p-8 text-white">
                  <h3 className="text-2xl font-bold mb-4">Emergency Support</h3>
                  <p className="mb-4">For urgent matters, our 24/7 emergency hotline is always available:</p>
                  <p className="text-2xl font-extrabold">+254 700 000 000</p>
                </div>

                <div className="bg-white rounded-2xl border-2 border-gray-200 p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Follow Us</h3>
                  <div className="flex gap-4">
                    {["Facebook", "Twitter", "LinkedIn", "Instagram"].map((social, index) => (
                      <button key={index} className="h-12 w-12 rounded-lg bg-gradient-to-br from-[#117c82] to-[#0d9ea6] hover:from-[#0d9ea6] hover:to-[#117c82] text-white flex items-center justify-center transition-all hover:scale-110">
                        {social[0]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
