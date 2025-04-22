import { createClient } from '@supabase/supabase-js'
import { Database } from '../src/types/database.types'
import { prompt } from 'enquirer'
import dotenv from 'dotenv'

dotenv.config()

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function setupAdmin() {
  try {
    const { email, password } = await prompt<{ email: string; password: string }>([
      {
        type: 'input',
        name: 'email',
        message: 'Enter admin email:',
        validate: (value: string) => {
          if (!value.includes('@')) return 'Please enter a valid email address'
          return true
        }
      },
      {
        type: 'password',
        name: 'password',
        message: 'Enter admin password:',
        validate: (value: string) => {
          if (value.length < 6) return 'Password must be at least 6 characters'
          return true
        }
      }
    ])

    // Sign up the user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (authError) throw authError

    if (!authData.user) {
      throw new Error('Failed to create user')
    }

    // Create the user record with admin role
    const { error: dbError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        email,
        role: 'admin'
      })

    if (dbError) throw dbError

    console.log('Admin user created successfully!')
    console.log('Please check your email to verify your account.')

  } catch (error) {
    console.error('Error setting up admin:', error)
    process.exit(1)
  }
}

setupAdmin() 