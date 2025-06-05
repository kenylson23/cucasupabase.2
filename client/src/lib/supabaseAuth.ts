import { supabase } from './supabase'

export interface AuthUser {
  id: string
  email: string
  user_metadata?: {
    name?: string
    role?: string
  }
}

// Autenticação para admin
export async function signInAdmin(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  
  if (error) throw error
  return data
}

// Registrar novo admin (apenas para configuração inicial)
export async function signUpAdmin(email: string, password: string, name: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        role: 'admin'
      }
    }
  })
  
  if (error) throw error
  return data
}

// Logout
export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

// Verificar usuário atual
export async function getCurrentUser(): Promise<AuthUser | null> {
  const { data: { user } } = await supabase.auth.getUser()
  return user as AuthUser | null
}

// Verificar se é admin
export function isAdmin(user: AuthUser | null): boolean {
  return user?.user_metadata?.role === 'admin'
}

// Hook para escutar mudanças de autenticação
export function onAuthStateChange(callback: (user: AuthUser | null) => void) {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(session?.user as AuthUser | null)
  })
}