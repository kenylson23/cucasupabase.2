import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { getCurrentUser, onAuthStateChange, isAdmin as checkIsAdmin, type NetlifyAuthUser } from '../lib/netlifyAuth'

interface AuthContextType {
  user: NetlifyAuthUser | null
  loading: boolean
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAdmin: false
})

export function NetlifyAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<NetlifyAuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificar usuário atual ao carregar
    getCurrentUser().then((user) => {
      setUser(user)
      setLoading(false)
    }).catch(() => {
      setUser(null)
      setLoading(false)
    })

    // Escutar mudanças de autenticação
    const { data: { subscription } } = onAuthStateChange((user) => {
      setUser(user)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const isAdmin = checkIsAdmin(user)

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de NetlifyAuthProvider')
  }
  return context
}