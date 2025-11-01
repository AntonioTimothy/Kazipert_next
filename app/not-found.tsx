// app/not-found.tsx
import { Suspense } from 'react'
import Link from 'next/link'

function SearchParamsComponent() {
  // If you need to use searchParams in 404, wrap it in Suspense
  return null
}

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Page Not Found</h2>
      <p className="mb-4">Could not find requested resource</p>
      <Link 
        href="/" 
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Return Home
      </Link>
      
      {/* Wrap any useSearchParams usage in Suspense */}
      <Suspense fallback={null}>
        <SearchParamsComponent />
      </Suspense>
    </div>
  )
}