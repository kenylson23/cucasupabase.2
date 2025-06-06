#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js';

console.log('🔍 Verificando usuário administrador existente...\n');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.log('❌ Configure as variáveis VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verificarAdminExistente() {
  // Lista de emails admin comuns para testar
  const possiveisEmails = [
    'admin@cuca.ao',
    'admin@admin.com', 
    'admin@localhost',
    'test@admin.com',
    'administrador@cuca.ao'
  ];
  
  // Senhas comuns para testar
  const possiveisSenhas = [
    'cuca2024admin',
    'admin123',
    'password',
    '123456',
    'admin'
  ];
  
  console.log('🔑 Testando credenciais de admin existentes...\n');
  
  for (const email of possiveisEmails) {
    for (const senha of possiveisSenhas) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email,
          password: senha
        });
        
        if (!error && data.user) {
          console.log(`✅ Admin encontrado!`);
          console.log(`Email: ${email}`);
          console.log(`Senha: ${senha}`);
          
          // Verificar metadata
          const metadata = data.user.user_metadata;
          console.log(`\n📋 Informações do usuário:`);
          console.log(`ID: ${data.user.id}`);
          console.log(`Email confirmado: ${data.user.email_confirmed_at ? 'Sim' : 'Não'}`);
          console.log(`Metadata:`, metadata);
          
          if (metadata?.role === 'admin') {
            console.log(`✅ Role de admin configurada corretamente`);
          } else {
            console.log(`⚠️ Role de admin não encontrada`);
            console.log(`Adicione no painel: {"role": "admin", "name": "Administrador CUCA"}`);
          }
          
          // Fazer logout
          await supabase.auth.signOut();
          
          // Testar acesso a tabelas admin
          await testarPermissoesAdmin(email, senha);
          
          return { email, senha, user: data.user };
        }
      } catch (err) {
        // Ignorar erros e continuar testando
      }
    }
  }
  
  console.log('❌ Nenhum usuário admin encontrado com credenciais padrão');
  console.log('\n📝 Para usar o sistema, configure um admin com:');
  console.log('Email: admin@cuca.ao');
  console.log('Senha: cuca2024admin');
  console.log('Metadata: {"role": "admin"}');
  
  return null;
}

async function testarPermissoesAdmin(email, senha) {
  console.log('\n🔐 Testando permissões de admin...');
  
  // Fazer login novamente
  const { data: loginData } = await supabase.auth.signInWithPassword({
    email, password: senha
  });
  
  if (!loginData.user) return;
  
  // Testar acesso a contact_messages
  try {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .limit(5);
      
    if (error) {
      console.log(`❌ Erro ao acessar mensagens: ${error.message}`);
    } else {
      console.log(`✅ Acesso a mensagens: ${data.length} registros`);
    }
  } catch (err) {
    console.log(`❌ Erro nas permissões: ${err.message}`);
  }
  
  // Testar acesso a fan_photos
  try {
    const { data, error } = await supabase
      .from('fan_photos')
      .select('*')
      .limit(5);
      
    if (error) {
      console.log(`❌ Erro ao acessar fotos: ${error.message}`);
    } else {
      console.log(`✅ Acesso a fotos: ${data.length} registros`);
    }
  } catch (err) {
    console.log(`❌ Erro nas fotos: ${err.message}`);
  }
  
  await supabase.auth.signOut();
}

async function main() {
  const admin = await verificarAdminExistente();
  
  if (admin) {
    console.log('\n🎉 Configuração de admin verificada com sucesso!');
    console.log(`Use ${admin.email} / ${admin.senha} para fazer login no painel admin`);
    console.log('\n🔗 URLs importantes:');
    console.log('- Landing page: /');
    console.log('- Login admin: /login-netlify'); 
    console.log('- Painel admin: /admin-netlify');
  } else {
    console.log('\n⚙️ Configure um usuário admin no painel do Supabase');
  }
}

main().catch(console.error);