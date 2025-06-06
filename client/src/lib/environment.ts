// Environment configuration for different deployment contexts
export const isNetlify = import.meta.env.VITE_APP_ENV === 'netlify'
export const isProduction = import.meta.env.PROD
export const isDevelopment = import.meta.env.DEV

export const config = {
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL,
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
  },
  app: {
    environment: import.meta.env.VITE_APP_ENV || 'development',
    title: 'CUCA - A Melhor de Angola',
    description: 'Cerveja CUCA - 73 anos de tradição e qualidade em Angola. Descubra o sabor da união.',
  }
}

// Authentication system detection
export function getAuthSystem(): 'supabase' | 'local' {
  if (isNetlify && config.supabase.url && config.supabase.anonKey) {
    return 'supabase'
  }
  return 'local'
}

// Validation
if (isNetlify && (!config.supabase.url || !config.supabase.anonKey)) {
  console.warn('Supabase credentials not configured. Some features may not work.')
}