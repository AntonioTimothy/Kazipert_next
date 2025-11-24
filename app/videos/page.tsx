import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import Image from "next/image"
import { Play, Clock, Eye, ThumbsUp, Filter, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function VideosPage() {
  const categories = [
    { name: "All Videos", count: 150, active: true },
    { name: "Training", count: 45 },
    { name: "Success Stories", count: 30 },
    { name: "Safety Tips", count: 25 },
    { name: "Language", count: 20 },
    { name: "Cultural", count: 30 }
  ]

  const videos = [
    {
      title: "Professional Housekeeping Basics",
      thumbnail: "/professional-housekeeping.jpg",
      duration: "15:30",
      views: "12.5K",
      likes: "1.2K",
      category: "Training"
    },
    {
      title: "Arabic Language for Beginners",
      thumbnail: "/arabic-language-learning.jpg",
      duration: "22:45",
      views: "18.3K",
      likes: "2.1K",
      category: "Language"
    },
    {
      title: "Emergency Safety Procedures",
      thumbnail: "/emergency-safety-procedures.jpg",
      duration: "10:20",
      views: "25.7K",
      likes: "3.5K",
      category: "Safety"
    },
    {
      title: "Effective Workplace Communication",
      thumbnail: "/effective-communication-workplace.png",
      duration: "18:15",
      views: "14.2K",
      likes: "1.8K",
      category: "Training"
    },
    {
      title: "Understanding Oman Culture",
      thumbnail: "/oman-culture-traditional.jpg",
      duration: "20:30",
      views: "16.8K",
      likes: "2.3K",
      category: "Cultural"
    },
    {
      title: "Kenya Cultural Traditions",
      thumbnail: "/kenya-culture-traditional.jpg",
      duration: "17:45",
      views: "13.4K",
      likes: "1.9K",
      category: "Cultural"
    },
    {
      title: "Legal Rights & Documentation",
      thumbnail: "/legal-rights-document.jpg",
      duration: "25:10",
      views: "22.1K",
      likes: "3.2K",
      category: "Legal"
    },
    {
      title: "Mental Wellness Support",
      thumbnail: "/mental-wellness-support.jpg",
      duration: "16:40",
      views: "19.5K",
      likes: "2.7K",
      category: "Wellness"
    }
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#117c82] via-[#0d9ea6] to-[#117c82] py-20 md:py-24">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-0 w-96 h-96 bg-[#FDB913]/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
          </div>

          <div className="container relative px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center text-white">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 mb-6">
                <Play className="h-4 w-4" />
                <span className="text-sm font-bold">Video Library</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
                Learn Through Video
              </h1>
              <p className="text-xl text-white/90 leading-relaxed mb-8">
                Access our comprehensive library of training videos, success stories, and educational content.
              </p>

              {/* Search Bar */}
              <div className="max-w-2xl mx-auto">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="Search videos..."
                    className="pl-12 pr-4 py-6 text-lg bg-white/95 backdrop-blur-sm border-2 border-white/50 focus:border-white"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-8 bg-white border-b border-gray-200 sticky top-16 z-40">
          <div className="container px-6 lg:px-8">
            <div className="flex items-center gap-4 overflow-x-auto pb-2">
              <Button variant="ghost" size="sm" className="flex items-center gap-2 flex-shrink-0">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
              {categories.map((category, index) => (
                <Button
                  key={index}
                  variant={category.active ? "default" : "outline"}
                  size="sm"
                  className={`flex-shrink-0 ${category.active ? "bg-[#117c82] hover:bg-[#117c82]/90" : "hover:bg-gray-100"}`}
                >
                  {category.name} ({category.count})
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Video Grid */}
        <section className="py-16 md:py-20 bg-gradient-to-b from-gray-50 to-white">
          <div className="container px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {videos.map((video, index) => (
                <div key={index} className="group bg-white rounded-2xl border-2 border-gray-200 hover:border-[#117c82] overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 cursor-pointer">
                  <div className="relative aspect-video">
                    <Image
                      src={video.thumbnail}
                      alt={video.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <div className="h-16 w-16 rounded-full bg-white/95 flex items-center justify-center group-hover:scale-110 transition-transform shadow-xl">
                        <Play className="h-7 w-7 text-[#117c82] fill-current ml-1" />
                      </div>
                    </div>
                    <div className="absolute bottom-3 right-3 bg-black/80 text-white px-2 py-1 rounded text-xs font-bold">
                      {video.duration}
                    </div>
                    <div className="absolute top-3 left-3 bg-[#FDB913] text-black px-3 py-1 rounded-full text-xs font-bold">
                      {video.category}
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <h3 className="text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-[#117c82] transition-colors">
                      {video.title}
                    </h3>

                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        <span>{video.views}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ThumbsUp className="h-4 w-4" />
                        <span>{video.likes}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-12">
              <Button size="lg" variant="outline" className="border-2 border-[#117c82] text-[#117c82] hover:bg-[#117c82] hover:text-white font-bold">
                Load More Videos
              </Button>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 md:py-20 bg-gradient-to-br from-[#117c82] to-[#0d9ea6]">
          <div className="container px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {[
                { value: "150+", label: "Total Videos" },
                { value: "500K+", label: "Total Views" },
                { value: "50K+", label: "Subscribers" },
                { value: "4.9", label: "Avg Rating" }
              ].map((stat, index) => (
                <div key={index} className="text-center text-white">
                  <div className="text-5xl font-extrabold mb-2">{stat.value}</div>
                  <div className="text-sm font-semibold text-white/90">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
