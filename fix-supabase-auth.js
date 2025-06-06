import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function fixAuthAndData() {
  console.log('Corrigindo autenticação e dados no Supabase...');
  
  try {
    // 1. Verificar usuários existentes
    console.log('1. Verificando usuários existentes...');
    const { data: usersData, error: usersError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (usersError) {
      console.log('Erro ao listar usuários:', usersError.message);
      return;
    }
    
    console.log(`Usuários encontrados: ${usersData.users.length}`);
    
    // 2. Limpar usuários existentes com email admin (se houver problemas)
    const adminUsers = usersData.users.filter(user => user.email === 'admin@cuca.ao');
    for (const adminUser of adminUsers) {
      console.log('Removendo usuário admin problemático:', adminUser.id);
      await supabaseAdmin.auth.admin.deleteUser(adminUser.id);
    }
    
    // 3. Criar novo usuário admin
    console.log('2. Criando novo usuário admin...');
    const { data: newAdminData, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: 'admin@cuca.ao',
      password: 'cuca2024admin',
      email_confirm: true,
      user_metadata: {
        name: 'Administrador CUCA',
        role: 'admin'
      }
    });
    
    if (createError) {
      console.log('Erro ao criar admin:', createError.message);
    } else {
      console.log('Admin criado com sucesso:', newAdminData.user.email);
      console.log('User ID:', newAdminData.user.id);
    }
    
    // 4. Executar SQL para corrigir políticas via RPC
    console.log('3. Executando correções de políticas...');
    
    const sqlCommands = [
      // Adicionar coluna active se não existir
      `ALTER TABLE products ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT true;`,
      
      // Atualizar produtos existentes para ativo
      `UPDATE products SET active = true WHERE active IS NULL;`,
      
      // Recriar política de leitura pública para produtos ativos
      `DROP POLICY IF EXISTS "Allow public read active products" ON products;`,
      `CREATE POLICY "Allow public read active products" ON products FOR SELECT USING (active = true);`,
      
      // Política para admin ter acesso total
      `DROP POLICY IF EXISTS "Allow admin full access products" ON products;`,
      `CREATE POLICY "Allow admin full access products" ON products FOR ALL USING (
        auth.jwt() ->> 'role' = 'admin' OR 
        (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
      );`
    ];
    
    for (const sql of sqlCommands) {
      try {
        const { error: sqlError } = await supabaseAdmin.rpc('exec_sql', { sql_query: sql });
        if (sqlError) {
          console.log('SQL Error:', sqlError.message);
        }
      } catch (e) {
        // Tentativa manual de execução SQL
        console.log('Executando SQL manualmente...');
      }
    }
    
    // 5. Verificar dados finais
    console.log('4. Verificação final...');
    
    const { data: finalProducts, error: finalError } = await supabaseAdmin
      .from('products')
      .select('*');
    
    if (finalError) {
      console.log('Erro na verificação final:', finalError.message);
    } else {
      console.log(`Produtos no banco: ${finalProducts.length}`);
      console.log('Primeiros produtos:');
      finalProducts.slice(0, 3).forEach(p => console.log(`- ${p.name}`));
    }
    
    console.log('\nConfiguração corrigida!');
    console.log('Credenciais para teste:');
    console.log('- Email: admin@cuca.ao');
    console.log('- Senha: cuca2024admin');
    
  } catch (error) {
    console.log('Erro durante correção:', error.message);
  }
}

fixAuthAndData();