import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  const supabaseResponse = NextResponse.next()

  console.log('Middleware - Request cookies:', request.cookies.getAll().map(c => ({
    name: c.name,
    value: c.value.substring(0, 20) + '...'
  })))

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          const cookies = request.cookies.getAll()
          console.log('Middleware - getAll cookies:', cookies.map(c => ({
            name: c.name,
            value: c.value.substring(0, 20) + '...'
          })))
          return cookies
        },
        setAll(cookiesToSet) {
          console.log('Middleware - Setting cookies:', cookiesToSet.map(c => ({
            name: c.name,
            value: c.value.substring(0, 20) + '...'
          })))
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Allow public access to root page and auth-related pages
  if (
    request.nextUrl.pathname === '/' ||
    request.nextUrl.pathname.startsWith('/login') ||
    request.nextUrl.pathname.startsWith('/auth') ||
    request.nextUrl.pathname.startsWith('/register') ||
    request.nextUrl.pathname.startsWith('/forgot-password')
  ) {
    return supabaseResponse
  }

  // Redirect to login if no user
  if (!user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Set user id header for downstream use
  supabaseResponse.headers.set('x-user-id', user.id)

  return supabaseResponse
} 