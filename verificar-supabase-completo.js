#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js';

console.log('🔍 Verificação Completa do Supabase - CUCA\n');

// Configuração do cliente
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.log('❌ Variáveis de ambiente não configuradas');
  console.log('Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verificarTabelasEPoliticas() {
  console.log('📊 Verificando tabelas e políticas...');
  
  const tabelas = [
    'contact_messages',
    'fan_photos', 
    'products',
    'analytics_events'
  ];
  
  for (const tabela of tabelas) {
    try {
      const { data, error } = await supabase
        .from(tabela)
        .select('count')
        .limit(1);
        
      if (error) {
        console.log(`❌ Tabela ${tabela}: ${error.message}`);
      } else {
        console.log(`✅ Tabela ${tabela}: OK`);
      }
    } catch (err) {
      console.log(`❌ Erro na tabela ${tabela}: ${err.message}`);
    }
  }
}

async function verificarUsuarioAdmin() {
  console.log('\n👤 Verificando usuário administrador...');
  
  try {
    // Tentar fazer login com credenciais padrão
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'admin@cuca.ao',
      password: 'cuca2024admin'
    });
    
    if (error) {
      console.log('❌ Usuário admin não encontrado ou senha incorreta');
      console.log('Crie o usuário no painel Authentication > Users');
      console.log('Email: admin@cuca.ao');
      console.log('Password: cuca2024admin');
      console.log('Metadata: {"role": "admin", "name": "Administrador CUCA"}');
    } else {
      console.log('✅ Usuário admin encontrado');
      
      // Verificar metadata
      const user = data.user;
      const metadata = user.user_metadata;
      
      if (metadata?.role === 'admin') {
        console.log('✅ Role admin configurada corretamente');
      } else {
        console.log('⚠️ Role admin não encontrada no metadata');
        console.log('Adicione {"role": "admin"} no User Meta Data');
      }
      
      // Fazer logout após teste
      await supabase.auth.signOut();
    }
  } catch (err) {
    console.log(`❌ Erro na verificação de admin: ${err.message}`);
  }
}

async function verificarProdutosPadrao() {
  console.log('\n🍺 Verificando produtos padrão...');
  
  try {
    const { data, error } = await supabase
      .from('products')
      .select('id, name')
      .eq('active', true);
      
    if (error) {
      console.log(`❌ Erro ao buscar produtos: ${error.message}`);
    } else if (data.length === 0) {
      console.log('⚠️ Nenhum produto encontrado');
      console.log('Execute o script SQL completo para inserir produtos');
    } else {
      console.log(`✅ ${data.length} produtos encontrados`);
      data.forEach(produto => {
        console.log(`  - ${produto.name}`);
      });
    }
  } catch (err) {
    console.log(`❌ Erro na verificação de produtos: ${err.message}`);
  }
}

async function testarInsercaoMensagem() {
  console.log('\n📧 Testando inserção de mensagem de contato...');
  
  try {
    const { data, error } = await supabase
      .from('contact_messages')
      .insert({
        name: 'Teste Sistema',
        email: 'teste@sistema.com',
        subject: 'Verificação automática',
        message: 'Esta é uma mensagem de teste do sistema de verificação.'
      })
      .select();
      
    if (error) {
      console.log(`❌ Erro ao inserir mensagem: ${error.message}`);
      console.log('Verifique as políticas RLS da tabela contact_messages');
    } else {
      console.log('✅ Inserção de mensagem funcionando');
      
      // Limpar mensagem de teste
      await supabase
        .from('contact_messages')
        .delete()
        .eq('email', 'teste@sistema.com');
    }
  } catch (err) {
    console.log(`❌ Erro no teste de inserção: ${err.message}`);
  }
}

async function main() {
  console.log(`🔗 Conectando ao Supabase: ${supabaseUrl}\n`);
  
  await verificarTabelasEPoliticas();
  await verificarUsuarioAdmin();
  await verificarProdutosPadrao();
  await testarInsercaoMensagem();
  
  console.log('\n📋 Resumo da Verificação:');
  console.log('- Execute este script após configurar o Supabase');
  console.log('- Corrija os itens marcados com ❌ ou ⚠️');
  console.log('- Quando tudo estiver ✅, seu site funcionará perfeitamente');
}

main().catch(console.error);