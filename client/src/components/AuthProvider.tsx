import { createContext, useContext, useEffect, useState } from 'react'
import type { AuthUser } from '../lib/supabaseAuth'
import { getCurrentUser, onAuthStateChange } from '../lib/supabaseAuth'

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAdmin: false
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificar usuário atual ao carregar
    getCurrentUser().then((user) => {
      setUser(user)
      setLoading(false)
    })

    // Escutar mudanças de autenticação
    const { data: { subscription } } = onAuthStateChange((user) => {
      setUser(user)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const isAdmin = user?.user_metadata?.role === 'admin'

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider')
  }
  return context
}