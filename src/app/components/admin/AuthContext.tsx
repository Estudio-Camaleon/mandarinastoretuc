import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { supabase } from '../../../lib/supabase'
import type { Session } from '@supabase/supabase-js'

interface AuthContextProps {
  session: Session | null
  loading: boolean
  refreshSession: () => Promise<void>
}

const AuthContext = createContext<AuthContextProps>({ session: null, loading: true, refreshSession: async () => {} })

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshSession = async () => {
    try {
      const { data: { session: currentSession } } = await supabase.auth.getSession()
      setSession(currentSession)
    } catch (err) {
      console.error('AuthContext: error refreshing session', err)
    }
  }

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session)
      if (event === 'INITIAL_SESSION') {
        setLoading(false)
      }
    })

    return () => {
      authListener?.subscription.unsubscribe()
    }
  }, [])

  return (
    <AuthContext.Provider value={{ session, loading, refreshSession }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
