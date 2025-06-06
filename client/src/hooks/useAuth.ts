import { useAuth as useUnifiedAuth } from '@/components/UnifiedAuthProvider'

export function useAuth() {
  const auth = useUnifiedAuth()
  return {
    ...auth,
    isAuthenticated: !!auth.user,
  }
}