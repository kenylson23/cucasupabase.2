// Script para criar usuário admin no Supabase
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Carregar variáveis de ambiente
dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

console.log('URL do Supabase:', supabaseUrl ? 'Configurado' : 'Não configurado')
console.log('Service Key:', supabaseServiceKey ? 'Configurado' : 'Não configurado')

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ VITE_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY são obrigatórios')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function createAdminUser() {
  const adminEmail = 'admin@cuca.ao'
  const adminPassword = 'cuca2024admin'
  
  try {
    console.log('🔄 Criando usuário admin...')
    
    // Tentar criar o usuário admin
    const { data, error } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      user_metadata: {
        name: 'Administrador CUCA',
        role: 'admin'
      },
      email_confirm: true
    })

    if (error) {
      if (error.message.includes('already registered')) {
        console.log('ℹ️ Usuário admin já existe, tentando atualizar...')
        
        // Se já existe, buscar o usuário
        const { data: users, error: listError } = await supabase.auth.admin.listUsers()
        
        if (listError) {
          console.error('❌ Erro ao listar usuários:', listError.message)
          return
        }
        
        const existingUser = users.users.find(u => u.email === adminEmail)
        
        if (existingUser) {
          // Atualizar metadados do usuário existente
          const { error: updateError } = await supabase.auth.admin.updateUserById(
            existingUser.id,
            {
              user_metadata: {
                name: 'Administrador CUCA',
                role: 'admin'
              }
            }
          )
          
          if (updateError) {
            console.error('❌ Erro ao atualizar usuário:', updateError.message)
            return
          }
          
          console.log('✅ Usuário admin atualizado com sucesso!')
          console.log('📧 Email:', adminEmail)
          console.log('🔑 Senha:', adminPassword)
          console.log('🆔 ID:', existingUser.id)
          return
        }
      }
      
      console.error('❌ Erro ao criar admin:', error.message)
      return
    }

    console.log('✅ Usuário admin criado com sucesso!')
    console.log('📧 Email:', adminEmail)
    console.log('🔑 Senha:', adminPassword)
    console.log('🆔 ID:', data.user.id)
    
  } catch (error) {
    console.error('❌ Erro inesperado:', error.message)
  }
}

createAdminUser()