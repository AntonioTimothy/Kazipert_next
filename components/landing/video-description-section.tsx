"use client"

import { useState } from "react"
import { Play, X, CheckCircle2, Shield, Users, Award } from "lucide-react"
import { Button } from "@/components/ui/button"

export function VideoDescriptionSection() {
    const [showVideo, setShowVideo] = useState(false)

    const highlights = [
        {
            icon: Shield,
            title: "Complete Protection",
            description: "Full legal coverage and insurance for all workers",
            color: "#117c82"
        },
        {
            icon: Users,
            title: "Verified Network",
            description: "All employers thoroughly vetted and verified",
            color: "#117c82"
        },
        {
            icon: Award,
            title: "Best Value",
            description: "Save over 80% compared to traditional agencies",
            color: "#FDB913"
        }
    ]

    return (
        <>
            <section className="relative py-16 md:py-20 lg:py-24 bg-gradient-to-b from-white via-gray-50 to-white overflow-hidden">
                {/* Background Decoration */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-10 right-10 w-72 h-72 bg-[#117c82]/5 rounded-full blur-3xl" />
                    <div className="absolute bottom-10 left-10 w-72 h-72 bg-[#FDB913]/5 rounded-full blur-3xl" />
                </div>

                <div className="container relative px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-7xl mx-auto">
                        {/* Left Column - Description */}
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#117c82]/10 to-[#FDB913]/10 rounded-full border border-[#117c82]/20">
                                    <span className="text-sm font-bold text-[#117c82]">✨ About Kazipert</span>
                                </div>

                                <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight">
                                    The World's First Platform for{" "}
                                    <span className="bg-gradient-to-r from-[#117c82] to-[#0d9ea6] bg-clip-text text-transparent">
                                        Domestic Worker Protection
                                    </span>
                                </h2>

                                <p className="text-lg text-gray-700 leading-relaxed">
                                    Kazipert revolutionizes the domestic worker industry by providing a comprehensive digital ecosystem that ensures safety, fairness, and legal protection for workers seeking employment abroad.
                                </p>
                            </div>

                            {/* Highlights */}
                            <div className="space-y-4">
                                {highlights.map((highlight, index) => (
                                    <div
                                        key={index}
                                        className="flex items-start gap-4 p-4 bg-white rounded-xl border-2 border-gray-200 hover:border-[#117c82] shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
                                    >
                                        <div
                                            className="h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0"
                                            style={{ backgroundColor: `${highlight.color}15` }}
                                        >
                                            <highlight.icon className="h-6 w-6" style={{ color: highlight.color }} />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900 mb-1">{highlight.title}</h3>
                                            <p className="text-sm text-gray-600 leading-relaxed">{highlight.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Key Stats */}
                            <div className="grid grid-cols-3 gap-4 pt-4">
                                <div className="text-center p-4 bg-gradient-to-br from-[#117c82]/10 to-[#117c82]/5 rounded-xl border border-[#117c82]/20">
                                    <div className="text-2xl md:text-3xl font-extrabold text-[#117c82]">10K+</div>
                                    <div className="text-xs text-gray-600 font-semibold mt-1">Workers</div>
                                </div>
                                <div className="text-center p-4 bg-gradient-to-br from-[#FDB913]/10 to-[#FDB913]/5 rounded-xl border border-[#FDB913]/20">
                                    <div className="text-2xl md:text-3xl font-extrabold text-[#FDB913]">98%</div>
                                    <div className="text-xs text-gray-600 font-semibold mt-1">Success</div>
                                </div>
                                <div className="text-center p-4 bg-gradient-to-br from-[#117c82]/10 to-[#FDB913]/10 rounded-xl border border-gray-200">
                                    <div className="text-2xl md:text-3xl font-extrabold text-[#117c82]">50+</div>
                                    <div className="text-xs text-gray-600 font-semibold mt-1">Partners</div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Video Player */}
                        <div className="relative">
                            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                                {/* Video Thumbnail/Poster */}
                                <div className="absolute inset-0 bg-gradient-to-br from-[#117c82] to-[#0d9ea6]">
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="text-center space-y-4">
                                            <div className="text-white text-2xl font-bold">Watch Our Story</div>
                                            <Button
                                                size="lg"
                                                onClick={() => setShowVideo(true)}
                                                className="group bg-white hover:bg-gray-100 text-[#117c82] font-bold shadow-xl hover:shadow-2xl transition-all transform hover:scale-110"
                                            >
                                                <Play className="h-6 w-6 mr-2 fill-current" />
                                                Play Video
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Decorative Elements */}
                                    <div className="absolute top-0 left-0 w-32 h-32 border-t-4 border-l-4 border-[#FDB913] rounded-tl-2xl opacity-50" />
                                    <div className="absolute bottom-0 right-0 w-32 h-32 border-b-4 border-r-4 border-[#FDB913] rounded-br-2xl opacity-50" />
                                </div>

                                {/* Floating Badge */}
                                <div className="absolute top-4 right-4 bg-[#FDB913] text-black px-4 py-2 rounded-full font-bold text-sm shadow-lg">
                                    2:30 min
                                </div>
                            </div>

                            {/* Glow Effect */}
                            <div className="absolute -inset-4 bg-gradient-to-br from-[#117c82]/20 to-[#FDB913]/20 rounded-3xl blur-2xl -z-10" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Video Modal */}
            {showVideo && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
                    <div className="relative w-full max-w-5xl">
                        {/* Close Button */}
                        <button
                            onClick={() => setShowVideo(false)}
                            className="absolute -top-12 right-0 text-white hover:text-[#FDB913] transition-colors"
                        >
                            <X className="h-8 w-8" />
                        </button>

                        {/* Video Player */}
                        <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl">
                            <video
                                controls
                                autoPlay
                                className="w-full h-full"
                                src="/about_us.mp4"
                            >
                                Your browser does not support the video tag.
                            </video>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
