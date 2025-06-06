// Sistema de autenticação para Netlify usando Supabase
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase não configurado para autenticação Netlify')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface NetlifyAuthUser {
  id: string
  email: string
  user_metadata?: {
    name?: string
    role?: string
  }
}

// Login admin para Netlify
export async function loginAdmin(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Erro no login:', error)
    throw error
  }
}

// Logout
export async function logoutAdmin() {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  } catch (error) {
    console.error('Erro no logout:', error)
    throw error
  }
}

// Verificar usuário atual
export async function getCurrentUser(): Promise<NetlifyAuthUser | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    return user as NetlifyAuthUser | null
  } catch (error) {
    console.error('Erro ao verificar usuário:', error)
    return null
  }
}

// Verificar se é admin
export function isAdmin(user: NetlifyAuthUser | null): boolean {
  return user?.user_metadata?.role === 'admin'
}

// Hook para escutar mudanças de autenticação
export function onAuthStateChange(callback: (user: NetlifyAuthUser | null) => void) {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(session?.user as NetlifyAuthUser | null)
  })
}

// Criar usuário admin (apenas uma vez)
export async function createAdminUser() {
  const adminEmail = 'admin@cuca.ao'
  const adminPassword = 'cuca2024admin'
  
  try {
    const { data, error } = await supabase.auth.signUp({
      email: adminEmail,
      password: adminPassword,
      options: {
        data: {
          name: 'Administrador CUCA',
          role: 'admin'
        }
      }
    })
    
    if (error) {
      // Se o usuário já existe, tenta fazer login
      if (error.message.includes('already registered')) {
        return await loginAdmin(adminEmail, adminPassword)
      }
      throw error
    }
    
    return data
  } catch (error) {
    console.error('Erro ao criar admin:', error)
    throw error
  }
}