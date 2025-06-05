import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function AdminSimpleSupabase() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [stats, setStats] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [photos, setPhotos] = useState<any[]>([])

  // Verificar se usuário está logado
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
      
      if (user) {
        loadData()
      }
    }
    
    checkUser()

    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null)
      if (session?.user) {
        loadData()
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const loadData = async () => {
    try {
      const [messagesResult, photosResult] = await Promise.all([
        supabase.from('contact_messages').select('*'),
        supabase.from('fan_photos').select('*')
      ])

      setMessages(messagesResult.data || [])
      setPhotos(photosResult.data || [])
      
      const totalMessages = messagesResult.data?.length || 0
      const pendingPhotos = photosResult.data?.filter(p => p.status === 'pending').length || 0
      
      setStats({
        totalMessages,
        pendingPhotos,
        approvedPhotos: photosResult.data?.filter(p => p.status === 'approved').length || 0
      })
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) throw error
    } catch (err: any) {
      setLoginError(err.message)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  const approvePhoto = async (photoId: number) => {
    try {
      await supabase
        .from('fan_photos')
        .update({ status: 'approved' })
        .eq('id', photoId)
      
      loadData()
    } catch (error) {
      console.error('Erro ao aprovar foto:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Carregando...</div>
      </div>
    )
  }

  // Página de login
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow">
          <div>
            <h2 className="text-center text-3xl font-bold text-gray-900">
              Admin CUCA
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Use: admin@cuca.ao / cuca2024admin
            </p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <input
                type="email"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <input
                type="password"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            {loginError && (
              <div className="text-red-600 text-sm">{loginError}</div>
            )}
            
            <button
              type="submit"
              className="w-full bg-amber-600 hover:bg-amber-700 text-white py-2 px-4 rounded-md"
            >
              Entrar
            </button>
          </form>
        </div>
      </div>
    )
  }

  // Painel administrativo
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Painel Admin CUCA
          </h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            Sair
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Estatísticas */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900">Mensagens</h3>
              <p className="text-3xl font-bold text-amber-600">{stats.totalMessages}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900">Fotos Pendentes</h3>
              <p className="text-3xl font-bold text-yellow-600">{stats.pendingPhotos}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900">Fotos Aprovadas</h3>
              <p className="text-3xl font-bold text-green-600">{stats.approvedPhotos}</p>
            </div>
          </div>
        )}

        {/* Mensagens */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-semibold">Mensagens de Contato</h2>
          </div>
          <div className="divide-y">
            {messages.slice(0, 5).map((message) => (
              <div key={message.id} className="p-6">
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium">{message.name}</p>
                    <p className="text-sm text-gray-600">{message.email}</p>
                    <p className="text-gray-800 mt-2">{message.message}</p>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(message.created_at).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fotos */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-semibold">Fotos de Fãs</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {photos.filter(p => p.status === 'pending').map((photo) => (
              <div key={photo.id} className="border rounded-lg p-4">
                {photo.photo_url && (
                  <img
                    src={photo.photo_url}
                    alt="Foto de fã"
                    className="w-full h-48 object-cover rounded mb-3"
                  />
                )}
                <p className="font-medium">{photo.user_name || 'Usuário'}</p>
                <p className="text-sm text-gray-600">{photo.email}</p>
                {photo.description && (
                  <p className="text-sm text-gray-800 mt-2">{photo.description}</p>
                )}
                <div className="mt-4 space-x-2">
                  <button
                    onClick={() => approvePhoto(photo.id)}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                  >
                    Aprovar
                  </button>
                  <button
                    onClick={() => {
                      supabase.from('fan_photos').update({ status: 'rejected' }).eq('id', photo.id)
                      loadData()
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                  >
                    Rejeitar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}