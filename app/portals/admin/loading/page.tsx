"use client"

export default function ComingSoonPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-900 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
            Coming Soon
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            This feature is currently under development. Please check back later.
          </p>
        </div>
      </div>
    </div>
  )
}