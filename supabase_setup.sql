-- Configuração completa das tabelas para o projeto CUCA no Supabase

-- Tabela para mensagens de contato
CREATE TABLE IF NOT EXISTS contact_messages (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(255),
  message TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela para fotos de fãs (opcional, para funcionalidade futura)
CREATE TABLE IF NOT EXISTS fan_photos (
  id SERIAL PRIMARY KEY,
  user_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  photo_url TEXT NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Habilitar Row Level Security
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE fan_photos ENABLE ROW LEVEL SECURITY;

-- Políticas para contact_messages
CREATE POLICY IF NOT EXISTS "Allow public insert on contact_messages" 
  ON contact_messages FOR INSERT 
  WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Allow authenticated read on contact_messages" 
  ON contact_messages FOR SELECT 
  USING (auth.role() = 'authenticated');

-- Políticas para fan_photos
CREATE POLICY IF NOT EXISTS "Allow public insert on fan_photos" 
  ON fan_photos FOR INSERT 
  WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Allow public read approved photos" 
  ON fan_photos FOR SELECT 
  USING (status = 'approved');

CREATE POLICY IF NOT EXISTS "Allow authenticated read all photos" 
  ON fan_photos FOR SELECT 
  USING (auth.role() = 'authenticated');

-- Criar função para notificação de novos contatos (opcional)
CREATE OR REPLACE FUNCTION notify_new_contact()
RETURNS TRIGGER AS $$
BEGIN
  -- Aqui pode adicionar lógica de notificação se necessário
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para novos contatos
DROP TRIGGER IF EXISTS on_new_contact ON contact_messages;
CREATE TRIGGER on_new_contact
  AFTER INSERT ON contact_messages
  FOR EACH ROW EXECUTE FUNCTION notify_new_contact();