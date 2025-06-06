// Detecção de ambiente para escolher o sistema de autenticação correto

export const isNetlify = () => {
  // Verificar se está rodando no Netlify
  return (
    typeof window !== 'undefined' && 
    (window.location.hostname.includes('netlify.app') ||
     window.location.hostname.includes('netlify.com') ||
     import.meta.env.VITE_APP_ENV === 'netlify' ||
     import.meta.env.NETLIFY === 'true')
  )
}

export const isReplit = () => {
  // Verificar se está rodando no Replit
  return (
    typeof window !== 'undefined' && 
    (window.location.hostname.includes('replit.dev') ||
     window.location.hostname.includes('repl.co') ||
     import.meta.env.REPL_ID !== undefined)
  )
}

export const getAuthSystem = () => {
  if (isNetlify()) {
    return 'supabase'
  }
  if (isReplit()) {
    return 'local'
  }
  // Default para desenvolvimento local
  return 'local'
}

export const getLoginPath = () => {
  return isNetlify() ? '/login-netlify' : '/login'
}

export const getAdminPath = () => {
  return isNetlify() ? '/admin' : '/admin'
}