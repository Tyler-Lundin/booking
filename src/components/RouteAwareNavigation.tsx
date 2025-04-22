'use client'

import { usePathname } from 'next/navigation'
import Navigation from './Navigation'

export default function RouteAwareNavigation() {
  const pathname = usePathname()
  
  // Show navigation for all routes except embed routes
  const shouldShowNavigation = pathname.startsWith('/')

  if (shouldShowNavigation) {
    return null
  }

  return <Navigation />
} 