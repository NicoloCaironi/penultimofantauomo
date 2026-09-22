'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { User } from '@supabase/supabase-js'
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client'

export default function ProfileButton() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setLoading(false)
      return
    }

    const supabase = createClient()

    // Controllo utente iniziale
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      setLoading(false)
    })

    // Ascolto cambi di stato autenticazione
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  // Chiusura del menu su click esterno o tasto ESC
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setUser(null)
    setIsOpen(false)
    router.refresh()
  }

  // Fallback iniziale per evitare layout shift durante il caricamento
  if (loading) {
    return (
      <div className="h-7 w-20 bg-ink/10 animate-pulse rounded-sm" aria-hidden="true" />
    )
  }

  // Utente NON loggato
  if (!user) {
    return (
      <Link
        href="/login"
        className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-mono tracking-wider uppercase font-semibold text-ink border border-ink/40 bg-[#f6efe1] hover:bg-ink hover:text-paper transition-all duration-150 shadow-[1px_1px_0px_#1b1811]"
        title="Accedi al giornale"
      >
        <svg
          className="w-3.5 h-3.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
        <span>Accedi</span>
      </Link>
    )
  }

  // Utente loggato: dati avatar e nome
  const userAvatar = user.user_metadata?.avatar_url || user.user_metadata?.picture
  const displayName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Lettore'
  const userInitial = displayName.charAt(0).toUpperCase()

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="inline-flex items-center gap-2 px-2.5 py-1 text-[11px] font-mono tracking-wider text-ink border border-ink/40 bg-[#f6efe1] hover:bg-[#eedfc4] transition-colors shadow-[1px_1px_0px_#1b1811]"
        aria-expanded={isOpen}
        aria-haspopup="true"
        title={`Profilo di ${displayName}`}
      >
        {userAvatar ? (
          <img
            src={userAvatar}
            alt={displayName}
            className="w-5 h-5 rounded-full object-cover border border-ink/40 filter sepia-[0.15]"
          />
        ) : (
          <span className="w-5 h-5 rounded-full bg-ink text-paper text-[10px] font-mono font-bold flex items-center justify-center">
            {userInitial}
          </span>
        )}
        <span className="max-w-[100px] truncate font-semibold uppercase">{displayName}</span>
        <svg
          className={`w-3 h-3 text-ink transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Menu a tendina vintage */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 border-2 border-ink bg-[#fcf8f0] p-4 shadow-[4px_4px_0px_rgba(27,24,17,0.15)] z-50 animate-in fade-in zoom-in-95 duration-100">
          <div className="border-b border-ink/20 pb-2.5 mb-2.5">
            <span className="inline-block font-mono text-[9px] tracking-[.15em] uppercase text-stamp font-bold mb-1">
              Tesserino Ufficiale
            </span>
            <p className="font-serif text-lg leading-tight font-bold text-ink truncate">
              {displayName}
            </p>
            <p className="font-mono text-[11px] text-meta truncate mt-0.5">
              {user.email}
            </p>
          </div>

          <div className="flex flex-col gap-2 pt-1">
            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="font-mono text-[11px] uppercase tracking-wider text-ink/80 hover:text-stamp hover:underline py-1"
            >
              Scheda Tesserato
            </Link>

            <button
              onClick={handleLogout}
              className="w-full text-left font-mono text-[11px] uppercase tracking-wider font-semibold text-stamp hover:bg-stamp/10 py-1.5 px-2 border border-stamp/40 transition-colors"
            >
              Disconnetti
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
