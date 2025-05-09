import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Embed Not Found</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">The embed you&apos;re looking for doesn&apos;t exist or has been removed.</p>
        <Link 
          href="/"
          className="text-indigo-600 hover:text-indigo-500 font-medium"
        >
          Return Home
        </Link>
      </div>
    </div>
  )
} 