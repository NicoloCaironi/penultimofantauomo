'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import type { User } from '@supabase/supabase-js'
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client'

type AuthMode = 'signin' | 'signup' | 'magiclink'

function LoginForm() {
  const [mode, setMode] = useState<AuthMode>('signin')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [initialCheckDone, setInitialCheckDone] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const router = useRouter()
  const searchParams = useSearchParams()
  const isConfigured = isSupabaseConfigured()

  useEffect(() => {
    // Controlla se è presente un errore dai parametri URL (es. redirect da callback)
    const errorParam = searchParams.get('error')
    if (errorParam === 'auth-failed') {
      setErrorMessage("Autenticazione non riuscita o link scaduto. Riprova.")
    }

    if (!isConfigured) {
      setInitialCheckDone(true)
      return
    }

    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      setCurrentUser(user)
      setInitialCheckDone(true)
    })
  }, [searchParams, isConfigured])

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    setSuccessMessage(null)

    if (!isConfigured) {
      setErrorMessage(
        "Supabase non è configurato. Inserisci NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY nel file .env.local"
      )
      return
    }

    if (!email) {
      setErrorMessage("Inserisci un indirizzo email valido.")
      return
    }

    setLoading(true)
    const supabase = createClient()

    try {
      if (mode === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) {
          setErrorMessage(error.message)
        } else {
          router.push('/')
          router.refresh()
        }
      } else if (mode === 'signup') {
        const { error, data } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        })
        if (error) {
          setErrorMessage(error.message)
        } else if (data.session) {
          // Se la conferma email non è richiesta su Supabase
          router.push('/')
          router.refresh()
        } else {
          // Conferma email richiesta
          setSuccessMessage(
            "Tesseramento avviato! Controlla la tua casella di posta per confermare l'iscrizione."
          )
        }
      } else if (mode === 'magiclink') {
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        })
        if (error) {
          setErrorMessage(error.message)
        } else {
          setSuccessMessage(
            "Ti abbiamo inviato un collegamento magico all'indirizzo indicato. Cliccalo per accedere direttamente!"
          )
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Si è verificato un errore imprevisto.'
      setErrorMessage(msg)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setErrorMessage(null)
    if (!isConfigured) {
      setErrorMessage(
        "Supabase non è configurato. Aggiungi le chiavi nel file .env.local per usare Google."
      )
      return
    }

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) {
        setErrorMessage(error.message)
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Errore durante l'accesso con Google."
      setErrorMessage(msg)
    }
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setCurrentUser(null)
    router.refresh()
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      {/* Testata della pagina di login */}
      <div className="text-center mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 font-mono text-xs tracking-wider uppercase text-meta hover:text-stamp transition-colors mb-4"
        >
          <span aria-hidden="true">&larr;</span> Torna alla prima pagina
        </Link>
        <h1
          className="font-serif text-4xl sm:text-5xl text-ink tracking-tight"
          style={{ textShadow: "0 1px 0 rgba(255,255,255,.35)" }}
        >
          PenultimoFantaUomo
        </h1>
        <p className="font-mono text-[11px] tracking-[.2em] uppercase text-stamp font-bold mt-2">
          Ufficio Tesseramento & Accesso Riservato
        </p>
      </div>

      {/* Riquadro tipo giornale vintage */}
      <div className="max-w-md w-full mx-auto border-4 border-double border-ink bg-[#fcf8ef] p-6 sm:p-8 shadow-[6px_6px_0px_rgba(27,24,17,0.15)] relative">
        {/* Avviso configurazione mancante se .env.local non è ancora valorizzato */}
        {!isConfigured && (
          <div className="mb-6 p-4 border border-stamp bg-[#faecea] text-ink text-xs font-mono">
            <p className="font-bold text-stamp uppercase mb-1">
              ⚠️ Configurazione Supabase richiesta
            </p>
            <p className="text-ink2 leading-relaxed">
              Per completare la connessione a Supabase, inserisci le tue chiavi nel file{' '}
              <code className="bg-paper px-1 py-0.5 border border-ink/30 font-semibold">
                .env.local
              </code>
              :
            </p>
            <div className="mt-2 p-2 bg-paper border border-ink/20 text-[11px] text-ink font-mono select-all">
              NEXT_PUBLIC_SUPABASE_URL=...<br />
              NEXT_PUBLIC_SUPABASE_ANON_KEY=...
            </div>
            <p className="mt-2 text-[10px] text-meta">
              Trovi i dati nella dashboard di Supabase sotto <em>Project Settings &rarr; API</em>.
            </p>
          </div>
        )}

        {/* Se l'utente è già autenticato */}
        {initialCheckDone && currentUser ? (
          <div className="text-center py-4">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full border-2 border-ink bg-[#f3ebd7] flex items-center justify-center font-serif text-2xl font-bold text-ink">
              {currentUser.user_metadata?.avatar_url ? (
                <img
                  src={currentUser.user_metadata.avatar_url}
                  alt="Avatar"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                (currentUser.user_metadata?.full_name || currentUser.email || 'U')
                  .charAt(0)
                  .toUpperCase()
              )}
            </div>

            <span className="font-mono text-[10px] tracking-[.2em] uppercase text-stamp font-bold block mb-1">
              Tesserato Riconosciuto
            </span>
            <h2 className="font-serif text-2xl text-ink font-bold">
              {currentUser.user_metadata?.full_name || 'Lettore Ufficiale'}
            </h2>
            <p className="font-mono text-xs text-meta mt-1 mb-6">
              {currentUser.email}
            </p>

            <div className="flex flex-col gap-3">
              <Link
                href="/"
                className="w-full py-2.5 px-4 bg-ink text-paper font-mono text-xs uppercase tracking-wider font-semibold hover:bg-ink2 transition-colors text-center"
              >
                Vai al Giornale &rarr;
              </Link>
              <button
                onClick={handleLogout}
                className="w-full py-2 px-4 border border-stamp text-stamp font-mono text-xs uppercase tracking-wider font-semibold hover:bg-stamp/10 transition-colors"
              >
                Disconnetti questo account
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Navigazione tra le schede: Accedi / Registrati / Link Magico */}
            <div className="grid grid-cols-3 border-b-2 border-ink mb-6 text-center font-mono text-[11px] uppercase tracking-wider font-semibold">
              <button
                type="button"
                onClick={() => {
                  setMode('signin')
                  setErrorMessage(null)
                  setSuccessMessage(null)
                }}
                className={`py-2 transition-colors ${
                  mode === 'signin'
                    ? 'border-b-2 border-stamp -mb-[2px] text-stamp font-bold bg-ink/5'
                    : 'text-meta hover:text-ink'
                }`}
              >
                Accedi
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('signup')
                  setErrorMessage(null)
                  setSuccessMessage(null)
                }}
                className={`py-2 transition-colors ${
                  mode === 'signup'
                    ? 'border-b-2 border-stamp -mb-[2px] text-stamp font-bold bg-ink/5'
                    : 'text-meta hover:text-ink'
                }`}
              >
                Registrati
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('magiclink')
                  setErrorMessage(null)
                  setSuccessMessage(null)
                }}
                className={`py-2 transition-colors ${
                  mode === 'magiclink'
                    ? 'border-b-2 border-stamp -mb-[2px] text-stamp font-bold bg-ink/5'
                    : 'text-meta hover:text-ink'
                }`}
              >
                Link Rapido
              </button>
            </div>

            {/* Messaggio di Errore */}
            {errorMessage && (
              <div className="mb-4 p-3 border border-stamp bg-[#faecea] text-stamp font-mono text-xs">
                {errorMessage}
              </div>
            )}

            {/* Messaggio di Successo */}
            {successMessage && (
              <div className="mb-4 p-3 border border-emerald-800 bg-[#edf5ee] text-emerald-800 font-mono text-xs">
                {successMessage}
              </div>
            )}

            {/* Accesso con Google */}
            {mode !== 'magiclink' && (
              <div className="mb-5">
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 py-2.5 px-4 border border-ink/40 bg-paper hover:bg-[#eae0ca] text-ink font-mono text-xs font-semibold uppercase tracking-wider shadow-[2px_2px_0px_#1b1811] transition-all disabled:opacity-50"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#EA4335"
                      d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.3l3.7 2.9C6.2 7.2 8.9 5 12 5z"
                    />
                    <path
                      fill="#4285F4"
                      d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.3 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.6 7.3C.6 9.3 0 11.6 0 14s.6 4.7 1.6 6.7l3.7-2.9z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.2-6.7-5.2L1.6 16C3.5 19.7 7.4 23 12 23z"
                    />
                  </svg>
                  Continua con Google
                </button>

                <div className="relative my-5 text-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-dotted border-ink/30" />
                  </div>
                  <span className="relative bg-[#fcf8ef] px-3 font-mono text-[10px] tracking-wider uppercase text-meta">
                    oppure con le tue credenziali
                  </span>
                </div>
              </div>
            )}

            {/* Form Email / Password */}
            <form onSubmit={handleEmailAuth} className="space-y-4">
              {mode === 'signup' && (
                <div>
                  <label
                    htmlFor="fullName"
                    className="block font-mono text-[11px] uppercase tracking-wider text-ink3 font-semibold mb-1"
                  >
                    Nome o Pseudonimo
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="es. Carlo Pellegatti"
                    className="w-full bg-[#f4ebd9] border border-ink/40 focus:border-ink focus:bg-[#fcf7ee] px-3 py-2 text-ink font-mono text-sm placeholder:text-meta/60 outline-none transition-colors"
                  />
                </div>
              )}

              <div>
                <label
                  htmlFor="email"
                  className="block font-mono text-[11px] uppercase tracking-wider text-ink3 font-semibold mb-1"
                >
                  Indirizzo E-mail
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="fantallenatore@esempio.it"
                  className="w-full bg-[#f4ebd9] border border-ink/40 focus:border-ink focus:bg-[#fcf7ee] px-3 py-2 text-ink font-mono text-sm placeholder:text-meta/60 outline-none transition-colors"
                />
              </div>

              {mode !== 'magiclink' && (
                <div>
                  <label
                    htmlFor="password"
                    className="block font-mono text-[11px] uppercase tracking-wider text-ink3 font-semibold mb-1"
                  >
                    Parola d'ordine (Password)
                  </label>
                  <input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#f4ebd9] border border-ink/40 focus:border-ink focus:bg-[#fcf7ee] px-3 py-2 text-ink font-mono text-sm placeholder:text-meta/60 outline-none transition-colors"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-ink text-paper hover:bg-ink2 font-mono text-xs uppercase tracking-widest font-semibold transition-colors shadow-[2px_2px_0px_#1b1811] disabled:opacity-50 mt-2"
              >
                {loading
                  ? 'Verifica in corso...'
                  : mode === 'signin'
                  ? 'Entra nel Giornale'
                  : mode === 'signup'
                  ? 'Registrati alla Lega'
                  : 'Invia Link Magico'}
              </button>
            </form>

            <div className="mt-6 text-center border-t border-ink/15 pt-4">
              <p className="font-serif italic text-xs text-ink3">
                {mode === 'signin'
                  ? 'Non hai ancora un tesserino?'
                  : mode === 'signup'
                  ? 'Sei già un tesserato ufficiale?'
                  : 'Preferisci usare la password?'}
                {' '}
                <button
                  type="button"
                  onClick={() => {
                    setErrorMessage(null)
                    setSuccessMessage(null)
                    if (mode === 'signin') setMode('signup')
                    else setMode('signin')
                  }}
                  className="font-mono text-[11px] uppercase tracking-wider font-semibold text-stamp underline hover:text-ink ml-1"
                >
                  {mode === 'signin' ? 'Iscriviti subito' : 'Accedi qui'}
                </button>
              </p>
            </div>
          </>
        )}
      </div>

      <footer className="mt-8 text-center font-mono text-[10px] tracking-wider uppercase text-meta">
        PenultimoFantaUomo &middot; Accesso Autenticato con Supabase
      </footer>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center font-mono text-xs uppercase tracking-wider text-meta">
          Caricamento Ufficio Tesseramento...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  )
}

