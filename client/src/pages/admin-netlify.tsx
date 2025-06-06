import { useState, useEffect } from 'react'
import { useLocation } from 'wouter'
import { useAuth } from '../components/NetlifyAuthProvider'
import { logoutAdmin } from '../lib/netlifyAuth'
import { supabase } from '../lib/supabase'

interface AdminStats {
  totalProducts: number
  totalMessages: number
  pendingPhotos: number
  approvedPhotos: number
}

export default function AdminNetlify() {
  const [, setLocation] = useLocation()
  const { user, isAdmin, loading } = useAuth()
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [photos, setPhotos] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState('overview')

  // Redirecionar se não for admin
  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      setLocation('/login-netlify')
    }
  }, [user, isAdmin, loading, setLocation])

  // Carregar dados do admin
  useEffect(() => {
    if (user && isAdmin) {
      loadAdminData()
    }
  }, [user, isAdmin])

  const loadAdminData = async () => {
    try {
      // Carregar estatísticas
      const [messagesResult, photosResult] = await Promise.all([
        supabase.from('contact_messages').select('*'),
        supabase.from('fan_photos').select('*')
      ])

      const totalMessages = messagesResult.data?.length || 0
      const pendingPhotos = photosResult.data?.filter(p => p.status === 'pending').length || 0
      const approvedPhotos = photosResult.data?.filter(p => p.status === 'approved').length || 0

      setStats({
        totalProducts: 3, // Valor fixo para produtos
        totalMessages,
        pendingPhotos,
        approvedPhotos
      })

      setMessages(messagesResult.data || [])
      setPhotos(photosResult.data || [])
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    }
  }

  const handleLogout = async () => {
    try {
      await logoutAdmin()
      setLocation('/')
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    }
  }

  const approvePhoto = async (photoId: number) => {
    try {
      await supabase
        .from('fan_photos')
        .update({ 
          status: 'approved',
          approved_by: user?.email || 'admin'
        })
        .eq('id', photoId)
      
      await loadAdminData()
    } catch (error) {
      console.error('Erro ao aprovar foto:', error)
    }
  }

  const rejectPhoto = async (photoId: number) => {
    try {
      await supabase
        .from('fan_photos')
        .update({ status: 'rejected' })
        .eq('id', photoId)
      
      await loadAdminData()
    } catch (error) {
      console.error('Erro ao rejeitar foto:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Carregando...</div>
      </div>
    )
  }

  if (!user || !isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Painel Administrativo CUCA
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Bem-vindo, {user.email}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {['overview', 'messages', 'photos'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab
                    ? 'border-amber-500 text-amber-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab === 'overview' && 'Resumo'}
                {tab === 'messages' && 'Mensagens'}
                {tab === 'photos' && 'Fotos de Fãs'}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="text-2xl">📦</div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                        Total de Produtos
                      </dt>
                      <dd className="text-lg font-medium text-gray-900 dark:text-white">
                        {stats.totalProducts}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="text-2xl">💬</div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                        Mensagens de Contato
                      </dt>
                      <dd className="text-lg font-medium text-gray-900 dark:text-white">
                        {stats.totalMessages}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="text-2xl">⏳</div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                        Fotos Pendentes
                      </dt>
                      <dd className="text-lg font-medium text-gray-900 dark:text-white">
                        {stats.pendingPhotos}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="text-2xl">✅</div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                        Fotos Aprovadas
                      </dt>
                      <dd className="text-lg font-medium text-gray-900 dark:text-white">
                        {stats.approvedPhotos}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                Mensagens de Contato ({messages.length})
              </h3>
            </div>
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {messages.map((message) => (
                <li key={message.id} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {message.name} ({message.email})
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {message.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(message.created_at).toLocaleString('pt-BR')}
                      </p>
                    </div>
                    <div className="ml-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        message.status === 'pending' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {message.status === 'pending' ? 'Pendente' : 'Respondida'}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Photos Tab */}
        {activeTab === 'photos' && (
          <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                Fotos de Fãs ({photos.length})
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {photos.map((photo) => (
                <div key={photo.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  {photo.photo_url && (
                    <img
                      src={photo.photo_url}
                      alt={photo.description || 'Foto de fã'}
                      className="w-full h-48 object-cover rounded-md mb-3"
                    />
                  )}
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {photo.user_name || 'Usuário'} ({photo.email})
                    </p>
                    {photo.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {photo.description}
                      </p>
                    )}
                    <p className="text-xs text-gray-400">
                      {new Date(photo.created_at).toLocaleString('pt-BR')}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        photo.status === 'pending' 
                          ? 'bg-yellow-100 text-yellow-800'
                          : photo.status === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {photo.status === 'pending' && 'Pendente'}
                        {photo.status === 'approved' && 'Aprovada'}
                        {photo.status === 'rejected' && 'Rejeitada'}
                      </span>
                      {photo.status === 'pending' && (
                        <div className="space-x-2">
                          <button
                            onClick={() => approvePhoto(photo.id)}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs"
                          >
                            Aprovar
                          </button>
                          <button
                            onClick={() => rejectPhoto(photo.id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs"
                          >
                            Rejeitar
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}