import { createBrowserClient } from '@supabase/ssr'
import { AuthChangeEvent, Session } from '@supabase/supabase-js'

let supabaseClient: ReturnType<typeof createBrowserClient> | null = null

export function createClient() {
  if (supabaseClient) {
    return supabaseClient
  }

  // Only run browser-specific code if we're in the browser
  if (typeof window !== 'undefined') {
    try {
      supabaseClient = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )

      // Add logging to the client's auth state changes
      supabaseClient.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
        console.log('Auth state changed:', {
          event,
          hasSession: !!session,
          sessionUser: session?.user?.email
        })
      })

      return supabaseClient
    } catch (error) {
      console.error('Error creating Supabase client:', error)
      throw error
    }
  }

  // Return a dummy client for SSR
  return {
    auth: {
      signInWithPassword: async () => ({ error: new Error('Not available during SSR') }),
      signOut: async () => ({ error: new Error('Not available during SSR') }),
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          single: async () => ({ data: null, error: new Error('Not available during SSR') })
        })
      })
    })
  } as ReturnType<typeof createBrowserClient>
} 