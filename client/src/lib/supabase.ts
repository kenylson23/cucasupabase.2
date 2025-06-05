import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key'

// Verificar se as variáveis estão configuradas
const isSupabaseConfigured = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY

if (!isSupabaseConfigured) {
  console.warn('Supabase não configurado. Algumas funcionalidades podem não funcionar.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Funções utilitárias para interagir com Supabase
export async function createContactMessage(data: {
  name: string
  email: string
  message: string
}) {
  const { data: result, error } = await supabase
    .from('contact_messages')
    .insert([
      {
        name: data.name,
        email: data.email,
        message: data.message,
        status: 'pending'
      }
    ])
    .select()
    .single()

  if (error) throw error
  return result
}

export async function createFanPhoto(data: {
  user_name: string
  email: string
  photo_url: string
  description?: string
}) {
  const { data: result, error } = await supabase
    .from('fan_photos')
    .insert([
      {
        user_name: data.user_name,
        email: data.email,
        photo_url: data.photo_url,
        description: data.description,
        status: 'pending'
      }
    ])
    .select()
    .single()

  if (error) throw error
  return result
}

export async function getApprovedFanPhotos() {
  const { data, error } = await supabase
    .from('fan_photos')
    .select('*')
    .eq('status', 'approved')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}