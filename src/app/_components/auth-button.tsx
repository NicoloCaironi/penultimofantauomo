'use client'

import { useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'

export default function AuthButton() {
    const [user, setUser] = useState<User | null>(null)
    const supabase = createClient()

    useEffect(() => {
    // Controlla la sessione iniziale
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user))

    // Ascolta i cambiamenti di autenticazione (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
    }, [supabase])

    const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        },
    })
    }

    const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    }

    if (user) {
    return (
        <div className="flex items-center gap-3">
        <span className="text-sm">Ciao, {user.user_metadata?.full_name || user.email}</span>
        <button
            onClick={handleLogout}
            className="rounded bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700"
        >
            Disconnetti
        </button>
        </div>
    )
    }

    return (
    <button
        onClick={handleLogin}
        className="flex items-center gap-2 rounded bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800"
    >
        Accedi con Google
    </button>
    )
}