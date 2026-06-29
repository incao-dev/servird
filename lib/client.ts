import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl) {
  throw new Error(
    'Missing required environment variable: NEXT_PUBLIC_SUPABASE_URL. ' +
      'Create .env.local from .env.example and set your Supabase project credentials.'
  )
}

if (!supabaseAnonKey) {
  throw new Error(
    'Missing required environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY. ' +
      'Create .env.local from .env.example and set your Supabase project credentials.'
  )
}

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)
