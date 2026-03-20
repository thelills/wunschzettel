import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const Ctx = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email, password, name) => {
    const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { name } } })
    if (!error && data.user) await supabase.from('profiles').upsert({ id: data.user.id, name, email })
    return { data, error }
  }

  const signIn = (email, password) => supabase.auth.signInWithPassword({ email, password })
  const signOut = () => supabase.auth.signOut()
  const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'Du'

  return (
    <Ctx.Provider value={{ user, loading, signUp, signIn, signOut, userName }}>
      {!loading && children}
    </Ctx.Provider>
  )
}

export const useAuth = () => useContext(Ctx)
