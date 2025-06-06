-- Script para corrigir políticas e inserir dados no Supabase
-- Execute este script no SQL Editor do Supabase

-- 1. Verificar se a coluna 'active' existe na tabela products
ALTER TABLE products ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT true;

-- 2. Corrigir políticas para permitir inserção pública de produtos (temporariamente)
DROP POLICY IF EXISTS "Allow public read active products" ON products;
DROP POLICY IF EXISTS "Allow admin full access products" ON products;

-- Política temporária para inserção de dados
CREATE POLICY "Allow all access products temp" ON products FOR ALL USING (true) WITH CHECK (true);

-- 3. Inserir produtos de exemplo
INSERT INTO products (name, description, price, image_url, category, active) VALUES
('CUCA Original', 'A cerveja angolana original com sabor único e tradição de mais de 50 anos', 150.00, '/images/cuca-original.jpg', 'cerveja', true),
('CUCA Premium', 'Versão premium da CUCA com ingredientes selecionados', 200.00, '/images/cuca-premium.jpg', 'cerveja', true),
('CUCA Light', 'Cerveja CUCA com menos calorias, mantendo o sabor autêntico', 150.00, '/images/cuca-light.jpg', 'cerveja', true),
('Pack CUCA 6x', 'Pack promocional com 6 cervejas CUCA Original', 800.00, '/images/cuca-pack6.jpg', 'pack', true),
('Pack CUCA 12x', 'Pack familiar com 12 cervejas CUCA Original', 1500.00, '/images/cuca-pack12.jpg', 'pack', true)
ON CONFLICT (name) DO NOTHING;

-- 4. Restaurar políticas corretas para products
DROP POLICY "Allow all access products temp" ON products;

CREATE POLICY "Allow public read active products" ON products 
  FOR SELECT USING (active = true);

CREATE POLICY "Allow admin full access products" ON products 
  FOR ALL USING (
    auth.jwt() ->> 'role' = 'admin' OR 
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- 5. Verificar se as outras políticas estão corretas
-- Políticas para contact_messages
DROP POLICY IF EXISTS "Allow public insert contact_messages" ON contact_messages;
CREATE POLICY "Allow public insert contact_messages" ON contact_messages 
  FOR INSERT WITH CHECK (true);

-- Políticas para fan_photos  
DROP POLICY IF EXISTS "Allow public insert fan_photos" ON fan_photos;
CREATE POLICY "Allow public insert fan_photos" ON fan_photos 
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read approved fan_photos" ON fan_photos;
CREATE POLICY "Allow public read approved fan_photos" ON fan_photos 
  FOR SELECT USING (status = 'approved');

-- 6. Verificar dados inseridos
SELECT 'Produtos inseridos:' as status, count(*) as total FROM products;
SELECT 'Políticas configuradas com sucesso' as result;