// Script para criar usuário admin inicial no Supabase
// Execute este script uma vez para configurar o admin

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY // Chave de serviço (não anônima)

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('VITE_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY são necessários')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createAdminUser() {
  const adminEmail = 'admin@cuca.ao'
  const adminPassword = 'cuca2024admin'
  
  try {
    console.log('Criando usuário admin...')
    
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
      console.error('Erro ao criar admin:', error.message)
      return
    }

    console.log('✓ Usuário admin criado com sucesso!')
    console.log('Email:', adminEmail)
    console.log('Senha:', adminPassword)
    console.log('ID:', data.user.id)
    
  } catch (error) {
    console.error('Erro:', error.message)
  }
}

createAdminUser()