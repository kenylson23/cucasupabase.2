// Sistema de autenticação unificado para Replit e Netlify
import { getAuthSystem } from './environment'
import { createClient } from '@supabase/supabase-js'

interface UnifiedAuthUser {
  id: string
  email: string
  name?: string
  role: string
}

class UnifiedAuth {
  private supabase: any = null
  private authSystem: string

  constructor() {
    this.authSystem = getAuthSystem()
    
    if (this.authSystem === 'supabase') {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
      
      if (supabaseUrl && supabaseAnonKey) {
        this.supabase = createClient(supabaseUrl, supabaseAnonKey)
      } else {
        console.warn('Supabase credentials not found, falling back to local auth')
        this.authSystem = 'local'
      }
    }
  }

  async login(email: string, password: string): Promise<any> {
    if (this.authSystem === 'supabase' && this.supabase) {
      return this.loginSupabase(email, password)
    } else {
      return this.loginLocal(email, password)
    }
  }

  async logout(): Promise<void> {
    if (this.authSystem === 'supabase' && this.supabase) {
      return this.logoutSupabase()
    } else {
      return this.logoutLocal()
    }
  }

  async getCurrentUser(): Promise<UnifiedAuthUser | null> {
    if (this.authSystem === 'supabase' && this.supabase) {
      return this.getCurrentUserSupabase()
    } else {
      return this.getCurrentUserLocal()
    }
  }

  onAuthStateChange(callback: (user: UnifiedAuthUser | null) => void) {
    if (this.authSystem === 'supabase' && this.supabase) {
      return this.supabase.auth.onAuthStateChange((event: any, session: any) => {
        const user = session?.user
        if (user) {
          callback({
            id: user.id,
            email: user.email,
            name: user.user_metadata?.name,
            role: user.user_metadata?.role || 'user'
          })
        } else {
          callback(null)
        }
      })
    } else {
      // Para autenticação local, usar polling simples
      const pollInterval = setInterval(async () => {
        const user = await this.getCurrentUserLocal()
        callback(user)
      }, 5000)
      
      return {
        data: {
          subscription: {
            unsubscribe: () => clearInterval(pollInterval)
          }
        }
      }
    }
  }

  // Métodos Supabase
  private async loginSupabase(email: string, password: string) {
    try {
      // Primeiro tenta login
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) {
        // Se falhar, tenta criar usuário
        if (error.message.includes('Invalid login credentials')) {
          const { data: signUpData, error: signUpError } = await this.supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                name: 'Administrador CUCA',
                role: 'admin'
              }
            }
          })
          
          if (signUpError) throw signUpError
          
          // Tenta login novamente
          const { data: loginData, error: loginError } = await this.supabase.auth.signInWithPassword({
            email,
            password
          })
          
          if (loginError) throw loginError
          return loginData
        }
        throw error
      }
      
      return data
    } catch (error) {
      console.error('Erro no login Supabase:', error)
      throw error
    }
  }

  private async logoutSupabase() {
    const { error } = await this.supabase.auth.signOut()
    if (error) throw error
  }

  private async getCurrentUserSupabase(): Promise<UnifiedAuthUser | null> {
    try {
      const { data: { user } } = await this.supabase.auth.getUser()
      if (user) {
        return {
          id: user.id,
          email: user.email,
          name: user.user_metadata?.name,
          role: user.user_metadata?.role || 'user'
        }
      }
      return null
    } catch (error) {
      console.error('Erro ao verificar usuário Supabase:', error)
      return null
    }
  }

  // Métodos Local (Replit)
  private async loginLocal(username: string, password: string) {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
      credentials: 'include',
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Erro no login')
    }

    return response.json()
  }

  private async logoutLocal() {
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    })

    if (!response.ok) {
      throw new Error('Erro no logout')
    }

    return response.json()
  }

  private async getCurrentUserLocal(): Promise<UnifiedAuthUser | null> {
    try {
      const response = await fetch('/api/auth/user', {
        credentials: 'include',
      })

      if (!response.ok) {
        return null
      }

      const user = await response.json()
      return {
        id: user.id,
        email: user.email,
        name: user.firstName + (user.lastName ? ` ${user.lastName}` : ''),
        role: user.role
      }
    } catch (error) {
      return null
    }
  }
}

export const unifiedAuth = new UnifiedAuth()
export type { UnifiedAuthUser }