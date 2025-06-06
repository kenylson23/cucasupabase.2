import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupSampleData() {
  console.log('Inserindo produtos de exemplo...');
  
  const products = [
    {
      name: 'CUCA Original',
      description: 'A cerveja angolana original com sabor único e tradição de mais de 50 anos',
      price: 150.00,
      image_url: '/images/cuca-original.jpg',
      category: 'cerveja',
      active: true
    },
    {
      name: 'CUCA Premium',
      description: 'Versão premium da CUCA com ingredientes selecionados',
      price: 200.00,
      image_url: '/images/cuca-premium.jpg',
      category: 'cerveja',
      active: true
    },
    {
      name: 'CUCA Light',
      description: 'Cerveja CUCA com menos calorias, mantendo o sabor autêntico',
      price: 150.00,
      image_url: '/images/cuca-light.jpg',
      category: 'cerveja',
      active: true
    },
    {
      name: 'Pack CUCA 6x',
      description: 'Pack promocional com 6 cervejas CUCA Original',
      price: 800.00,
      image_url: '/images/cuca-pack6.jpg',
      category: 'pack',
      active: true
    },
    {
      name: 'Pack CUCA 12x',
      description: 'Pack familiar com 12 cervejas CUCA Original',
      price: 1500.00,
      image_url: '/images/cuca-pack12.jpg',
      category: 'pack',
      active: true
    }
  ];

  try {
    const { data, error } = await supabase
      .from('products')
      .insert(products)
      .select();

    if (error) {
      console.log('Erro ao inserir produtos:', error.message);
    } else {
      console.log(`Inseridos ${data.length} produtos com sucesso`);
    }
  } catch (error) {
    console.log('Erro:', error.message);
  }
}

async function checkAuth() {
  console.log('Verificando configuração de autenticação...');
  
  try {
    const { data: { users }, error } = await supabase.auth.admin.listUsers();
    
    if (error) {
      console.log('Não foi possível verificar usuários (necessário Service Role Key)');
    } else {
      console.log(`Usuários encontrados: ${users.length}`);
      const adminUser = users.find(user => 
        user.email === 'admin@cuca.ao' || 
        user.user_metadata?.role === 'admin'
      );
      
      if (adminUser) {
        console.log('Usuário admin encontrado:', adminUser.email);
      } else {
        console.log('Usuário admin não encontrado - precisa ser criado no painel do Supabase');
      }
    }
  } catch (error) {
    console.log('Verificação de usuários não disponível com chave anônima');
  }
}

setupSampleData().then(() => checkAuth());