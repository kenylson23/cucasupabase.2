import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.log('Erro: Variáveis de ambiente não configuradas');
  process.exit(1);
}

// Cliente com Service Role Key para operações administrativas
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function setupDatabase() {
  console.log('Configurando banco de dados com Service Role Key...');
  
  try {
    // 1. Inserir produtos de exemplo
    console.log('1. Inserindo produtos de exemplo...');
    const products = [
      {
        name: 'CUCA Original',
        description: 'A cerveja angolana original com sabor único e tradição de mais de 50 anos',
        price: 150.00,
        image_url: '/images/cuca-original.jpg',
        category: 'cerveja'
      },
      {
        name: 'CUCA Premium',
        description: 'Versão premium da CUCA com ingredientes selecionados',
        price: 200.00,
        image_url: '/images/cuca-premium.jpg',
        category: 'cerveja'
      },
      {
        name: 'CUCA Light',
        description: 'Cerveja CUCA com menos calorias, mantendo o sabor autêntico',
        price: 150.00,
        image_url: '/images/cuca-light.jpg',
        category: 'cerveja'
      },
      {
        name: 'Pack CUCA 6x',
        description: 'Pack promocional com 6 cervejas CUCA Original',
        price: 800.00,
        image_url: '/images/cuca-pack6.jpg',
        category: 'pack'
      },
      {
        name: 'Pack CUCA 12x',
        description: 'Pack familiar com 12 cervejas CUCA Original',
        price: 1500.00,
        image_url: '/images/cuca-pack12.jpg',
        category: 'pack'
      }
    ];

    const { data: insertedProducts, error: productError } = await supabaseAdmin
      .from('products')
      .insert(products)
      .select();

    if (productError) {
      console.log('Erro ao inserir produtos:', productError.message);
    } else {
      console.log(`Produtos inseridos: ${insertedProducts.length}`);
    }

    // 2. Criar usuário admin
    console.log('2. Criando usuário administrador...');
    const { data: adminUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: 'admin@cuca.ao',
      password: 'cuca2024admin',
      email_confirm: true,
      user_metadata: {
        name: 'Administrador CUCA',
        role: 'admin'
      }
    });

    if (authError) {
      if (authError.message.includes('already registered')) {
        console.log('Usuário admin já existe');
      } else {
        console.log('Erro ao criar usuário admin:', authError.message);
      }
    } else {
      console.log('Usuário admin criado:', adminUser.user.email);
    }

    // 3. Verificar configuração final
    console.log('3. Verificando configuração final...');
    
    const { data: finalProducts, error: checkError } = await supabaseAdmin
      .from('products')
      .select('*');

    if (checkError) {
      console.log('Erro ao verificar produtos:', checkError.message);
    } else {
      console.log(`Total de produtos no banco: ${finalProducts.length}`);
    }

    console.log('\nConfiguração do Supabase concluída!');
    console.log('Credenciais admin:');
    console.log('- Email: admin@cuca.ao');
    console.log('- Senha: cuca2024admin');
    
  } catch (error) {
    console.log('Erro durante configuração:', error.message);
  }
}

setupDatabase();