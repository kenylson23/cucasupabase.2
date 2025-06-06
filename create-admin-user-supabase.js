import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

async function createAdminAndTest() {
  console.log('Criando usuário admin e testando sistema...');
  
  try {
    // 1. Criar usuário admin diretamente
    console.log('1. Criando usuário admin...');
    
    const { data: users } = await supabaseAdmin.auth.admin.listUsers();
    const existingAdmin = users.users.find(user => user.email === 'admin@cuca.ao');
    
    if (existingAdmin) {
      console.log('Usuário admin já existe:', existingAdmin.email);
      console.log('ID:', existingAdmin.id);
    } else {
      const { data: newUser, error } = await supabaseAdmin.auth.admin.createUser({
        email: 'admin@cuca.ao',
        password: 'cuca2024admin',
        email_confirm: true,
        user_metadata: {
          name: 'Administrador CUCA',
          role: 'admin'
        }
      });
      
      if (error) {
        console.log('Erro ao criar usuário:', error.message);
      } else {
        console.log('Usuário admin criado:', newUser.user.email);
      }
    }
    
    // 2. Testar login com credenciais
    console.log('2. Testando login admin...');
    
    const { data: session, error: loginError } = await supabaseClient.auth.signInWithPassword({
      email: 'admin@cuca.ao',
      password: 'cuca2024admin'
    });
    
    if (loginError) {
      console.log('Erro no login:', loginError.message);
    } else {
      console.log('Login realizado com sucesso');
      console.log('User ID:', session.user.id);
      console.log('Role:', session.user.user_metadata?.role);
      
      // 3. Testar acesso aos dados como admin
      console.log('3. Testando acesso aos dados...');
      
      const { data: products, error: productsError } = await supabaseClient
        .from('products')
        .select('*');
      
      if (productsError) {
        console.log('Erro ao acessar produtos:', productsError.message);
      } else {
        console.log(`Produtos acessíveis como admin: ${products.length}`);
      }
      
      // Logout
      await supabaseClient.auth.signOut();
    }
    
    // 4. Testar acesso público aos produtos
    console.log('4. Testando acesso público...');
    
    const { data: publicProducts, error: publicError } = await supabaseClient
      .from('products')
      .select('*');
    
    if (publicError) {
      console.log('Acesso público bloqueado (esperado):', publicError.message);
    } else {
      console.log(`Produtos acessíveis publicamente: ${publicProducts.length}`);
    }
    
    console.log('\nTeste completo do sistema de autenticação concluído!');
    
  } catch (error) {
    console.log('Erro durante teste:', error.message);
  }
}

createAdminAndTest();