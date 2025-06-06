import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { unifiedAuth, type UnifiedAuthUser } from '../lib/unifiedAuth'

interface AuthContextType {
  user: UnifiedAuthUser | null
  loading: boolean
  isAdmin: boolean
  login: (email: string, password: string) => Promise<any>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAdmin: false,
  login: async () => {},
  logout: async () => {}
})

export function UnifiedAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UnifiedAuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificar usuário atual ao carregar
    unifiedAuth.getCurrentUser().then((user) => {
      setUser(user)
      setLoading(false)
    }).catch(() => {
      setUser(null)
      setLoading(false)
    })

    // Escutar mudanças de autenticação
    const { data: { subscription } } = unifiedAuth.onAuthStateChange((user) => {
      setUser(user)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      const result = await unifiedAuth.login(email, password)
      const currentUser = await unifiedAuth.getCurrentUser()
      setUser(currentUser)
      return result
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    setLoading(true)
    try {
      await unifiedAuth.logout()
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const isAdmin = user?.role === 'admin'

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      isAdmin, 
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de UnifiedAuthProvider')
  }
  return context
}