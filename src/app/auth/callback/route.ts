import { NextResponse } from 'next/server'
import { createServerSupabaseClient, isSupabaseConfigured } from '@/lib/supabase/server-client'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code && isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabaseClient()
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      if (!error) {
        return NextResponse.redirect(`${origin}${next}`)
      }
      console.error('Supabase exchangeCode error:', error.message)
    } catch (err) {
      console.error('Error during Supabase code exchange:', err)
    }
  }

  // In caso di errore o configurazione mancante
  return NextResponse.redirect(`${origin}/login?error=auth-failed`)
}