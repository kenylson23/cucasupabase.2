import { createContext, useContext, ReactNode } from 'react'
import { useQuery } from '@tanstack/react-query'

interface AuthUser {
  id: string
  username: string
  email: string
  firstName: string
  lastName: string
  role: string
}

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

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: user, isLoading } = useQuery<AuthUser>({
    queryKey: ["/api/auth/user"],
    retry: false,
    refetchOnWindowFocus: false,
  })

  const isAdmin = user?.role === 'admin'

  return (
    <AuthContext.Provider value={{ 
      user: user || null, 
      loading: isLoading, 
      isAdmin 
    }}>
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