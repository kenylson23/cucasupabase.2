import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixAndInsertProducts() {
  console.log('Inserindo produtos sem a coluna active...');
  
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

  try {
    const { data, error } = await supabase
      .from('products')
      .insert(products)
      .select();

    if (error) {
      console.log('Erro ao inserir produtos:', error.message);
      console.log('Detalhes:', error.details);
    } else {
      console.log(`Produtos inseridos com sucesso: ${data.length}`);
      data.forEach(product => {
        console.log(`- ${product.name}`);
      });
    }
  } catch (error) {
    console.log('Erro:', error.message);
  }
}

fixAndInsertProducts();