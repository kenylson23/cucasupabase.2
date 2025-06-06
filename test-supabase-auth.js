// Teste rápido da autenticação Supabase
import { createClient } from '@supabase/supabase-js'

// Usar variáveis diretamente do environment
const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

console.log('Testing Supabase connection...')
console.log('URL configured:', !!supabaseUrl)
console.log('Service key configured:', !!supabaseServiceKey)

if (!supabaseUrl || !supabaseServiceKey) {
  console.log('Missing credentials - will create user via client auth')
  
  // Fallback: usar auth do cliente
  const anonKey = process.env.VITE_SUPABASE_ANON_KEY
  if (supabaseUrl && anonKey) {
    const supabase = createClient(supabaseUrl, anonKey)
    
    console.log('Attempting to sign up admin user...')
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email: 'admin@cuca.ao',
        password: 'cuca2024admin',
        options: {
          data: {
            name: 'Administrador CUCA',
            role: 'admin'
          }
        }
      })
      
      if (error) {
        console.log('Sign up error (expected if user exists):', error.message)
      } else {
        console.log('✅ Admin user created successfully!')
      }
      
      // Testar login
      const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
        email: 'admin@cuca.ao',
        password: 'cuca2024admin'
      })
      
      if (loginError) {
        console.log('❌ Login failed:', loginError.message)
      } else {
        console.log('✅ Login successful!')
        console.log('User ID:', loginData.user?.id)
        console.log('Email:', loginData.user?.email)
        console.log('Role:', loginData.user?.user_metadata?.role)
      }
      
    } catch (err) {
      console.error('❌ Error:', err.message)
    }
  }
} else {
  // Usar service key
  const supabase = createClient(supabaseUrl, supabaseServiceKey)
  
  try {
    const { data, error } = await supabase.auth.admin.createUser({
      email: 'admin@cuca.ao',
      password: 'cuca2024admin',
      user_metadata: {
        name: 'Administrador CUCA',
        role: 'admin'
      },
      email_confirm: true
    })
    
    if (error) {
      console.log('Admin creation error:', error.message)
    } else {
      console.log('✅ Admin user created via service key!')
    }
  } catch (err) {
    console.error('❌ Service key error:', err.message)
  }
}