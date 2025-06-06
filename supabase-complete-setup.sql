-- Script completo para configurar o banco Supabase para o site CUCA
-- Execute este script no SQL Editor do Supabase

-- 1. Tabela de mensagens de contato
CREATE TABLE IF NOT EXISTS contact_messages (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(255),
  message TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

-- 2. Tabela de fotos de fãs
CREATE TABLE IF NOT EXISTS fan_photos (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  image_url TEXT NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  approved_by VARCHAR(255),
  approved_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 3. Tabela de produtos (para showcase)
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2),
  image_url TEXT,
  category VARCHAR(100),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 4. Tabela de analytics/eventos
CREATE TABLE IF NOT EXISTS analytics_events (
  id SERIAL PRIMARY KEY,
  event_type VARCHAR(100) NOT NULL,
  event_data JSONB,
  user_id UUID REFERENCES auth.users(id),
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 5. Habilitar Row Level Security
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE fan_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- 6. Políticas para contact_messages
CREATE POLICY "Allow public insert contact_messages" ON contact_messages 
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated read contact_messages" ON contact_messages 
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow admin update contact_messages" ON contact_messages 
  FOR UPDATE USING (
    auth.jwt() ->> 'role' = 'admin' OR 
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- 7. Políticas para fan_photos
CREATE POLICY "Allow public insert fan_photos" ON fan_photos 
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read approved fan_photos" ON fan_photos 
  FOR SELECT USING (status = 'approved');

CREATE POLICY "Allow admin read all fan_photos" ON fan_photos 
  FOR SELECT USING (
    auth.jwt() ->> 'role' = 'admin' OR 
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

CREATE POLICY "Allow admin update fan_photos" ON fan_photos 
  FOR UPDATE USING (
    auth.jwt() ->> 'role' = 'admin' OR 
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

CREATE POLICY "Allow admin delete fan_photos" ON fan_photos 
  FOR DELETE USING (
    auth.jwt() ->> 'role' = 'admin' OR 
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- 8. Políticas para products
CREATE POLICY "Allow public read active products" ON products 
  FOR SELECT USING (active = true);

CREATE POLICY "Allow admin full access products" ON products 
  FOR ALL USING (
    auth.jwt() ->> 'role' = 'admin' OR 
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- 9. Políticas para analytics_events
CREATE POLICY "Allow public insert analytics_events" ON analytics_events 
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow admin read analytics_events" ON analytics_events 
  FOR SELECT USING (
    auth.jwt() ->> 'role' = 'admin' OR 
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- 10. Inserir produtos de exemplo
INSERT INTO products (name, description, price, image_url, category, active) VALUES
('CUCA Original', 'A cerveja angolana original com sabor único e tradição de mais de 50 anos', 150.00, '/images/cuca-original.jpg', 'cerveja', true),
('CUCA Premium', 'Versão premium da CUCA com ingredientes selecionados', 200.00, '/images/cuca-premium.jpg', 'cerveja', true),
('CUCA Light', 'Cerveja CUCA com menos calorias, mantendo o sabor autêntico', 150.00, '/images/cuca-light.jpg', 'cerveja', true),
('Pack CUCA 6x', 'Pack promocional com 6 cervejas CUCA Original', 800.00, '/images/cuca-pack6.jpg', 'pack', true),
('Pack CUCA 12x', 'Pack familiar com 12 cervejas CUCA Original', 1500.00, '/images/cuca-pack12.jpg', 'pack', true)
ON CONFLICT DO NOTHING;

-- 11. Função para inserir evento de analytics
CREATE OR REPLACE FUNCTION insert_analytics_event(
  event_type_param VARCHAR(100),
  event_data_param JSONB DEFAULT NULL,
  ip_address_param INET DEFAULT NULL,
  user_agent_param TEXT DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
  event_id UUID;
BEGIN
  INSERT INTO analytics_events (event_type, event_data, user_id, ip_address, user_agent)
  VALUES (event_type_param, event_data_param, auth.uid(), ip_address_param, user_agent_param)
  RETURNING id INTO event_id;
  
  RETURN event_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 12. Função para aprovar foto de fã
CREATE OR REPLACE FUNCTION approve_fan_photo(
  photo_id INTEGER,
  admin_email VARCHAR(255)
) RETURNS BOOLEAN AS $$
BEGIN
  -- Verificar se o usuário é admin
  IF NOT (
    auth.jwt() ->> 'role' = 'admin' OR 
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  ) THEN
    RETURN FALSE;
  END IF;
  
  UPDATE fan_photos 
  SET 
    status = 'approved',
    approved_by = admin_email,
    approved_at = NOW()
  WHERE id = photo_id;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 13. Função para rejeitar foto de fã
CREATE OR REPLACE FUNCTION reject_fan_photo(
  photo_id INTEGER,
  admin_email VARCHAR(255)
) RETURNS BOOLEAN AS $$
BEGIN
  -- Verificar se o usuário é admin
  IF NOT (
    auth.jwt() ->> 'role' = 'admin' OR 
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  ) THEN
    RETURN FALSE;
  END IF;
  
  UPDATE fan_photos 
  SET 
    status = 'rejected',
    approved_by = admin_email,
    approved_at = NOW()
  WHERE id = photo_id;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 14. Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_fan_photos_status ON fan_photos(status);
CREATE INDEX IF NOT EXISTS idx_fan_photos_created_at ON fan_photos(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(active);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON analytics_events(created_at DESC);

-- Fim do script