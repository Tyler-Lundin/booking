import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()
  console.log('Server Client - Initial cookies:', cookieStore.getAll().map(c => ({
    name: c.name,
    value: c.value.substring(0, 20) + '...'
  })))

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          const allCookies = cookieStore.getAll()
          console.log('Server Client - getAll cookies:', allCookies.map(c => ({
            name: c.name,
            value: c.value.substring(0, 20) + '...'
          })))
          return allCookies
        },
        setAll(cookiesToSet) {
          console.log('Server Client - Setting cookies:', cookiesToSet.map(c => ({
            name: c.name,
            value: c.value.substring(0, 20) + '...'
          })))
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch (error) {
            console.error('Server Client - Error setting cookies:', error)
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
} 