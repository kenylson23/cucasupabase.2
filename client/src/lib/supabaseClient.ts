import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://cgugnbhqstihltobzimn.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNndWduYmhxc3RpaGx0b2J6aW1uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3ODIwMjEsImV4cCI6MjA1OTM1ODAyMX0.HBvkxrQQzPr5wnb3IMQJqQrlihhEGGaGvMY3wBAVG40'

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL e chave são obrigatórias')
}

export const supabase = createClient(supabaseUrl, supabaseKey)