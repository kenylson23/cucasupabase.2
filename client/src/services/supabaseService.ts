import { supabase } from '@/lib/supabaseClient'
import type {
  User, InsertUser,
  Product, InsertProduct,
  Order, InsertOrder,
  OrderItem, InsertOrderItem,
  ContactMessage, InsertContactMessage,
  AnalyticsEvent, InsertAnalyticsEvent,
  FanPhoto, InsertFanPhoto,
  AdminUser, UpsertAdminUser
} from '@shared/schema'

// Users Operations
export const usersService = {
  async getAll(): Promise<User[]> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw new Error(`Erro ao buscar utilizadores: ${error.message}`)
    return data || []
  },

  async getById(id: number): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error && error.code !== 'PGRST116') throw new Error(`Erro ao buscar utilizador: ${error.message}`)
    return data || null
  },

  async create(userData: InsertUser): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .insert(userData)
      .select()
      .single()
    
    if (error) throw new Error(`Erro ao criar utilizador: ${error.message}`)
    return data
  },

  async update(id: number, updates: Partial<User>): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw new Error(`Erro ao atualizar utilizador: ${error.message}`)
    return data
  },

  async delete(id: number): Promise<void> {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id)
    
    if (error) throw new Error(`Erro ao eliminar utilizador: ${error.message}`)
  }
}

// Products Operations
export const productsService = {
  async getAll(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw new Error(`Erro ao buscar produtos: ${error.message}`)
    return data || []
  },

  async getById(id: number): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error && error.code !== 'PGRST116') throw new Error(`Erro ao buscar produto: ${error.message}`)
    return data || null
  },

  async create(productData: InsertProduct): Promise<Product> {
    const { data, error } = await supabase
      .from('products')
      .insert(productData)
      .select()
      .single()
    
    if (error) throw new Error(`Erro ao criar produto: ${error.message}`)
    return data
  },

  async update(id: number, updates: Partial<Product>): Promise<Product> {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw new Error(`Erro ao atualizar produto: ${error.message}`)
    return data
  },

  async delete(id: number): Promise<void> {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)
    
    if (error) throw new Error(`Erro ao eliminar produto: ${error.message}`)
  }
}

// Orders Operations
export const ordersService = {
  async getAll(): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw new Error(`Erro ao buscar encomendas: ${error.message}`)
    return data || []
  },

  async getById(id: number): Promise<Order | null> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error && error.code !== 'PGRST116') throw new Error(`Erro ao buscar encomenda: ${error.message}`)
    return data || null
  },

  async getByUserId(userId: number): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) throw new Error(`Erro ao buscar encomendas do utilizador: ${error.message}`)
    return data || []
  },

  async create(orderData: InsertOrder): Promise<Order> {
    const { data, error } = await supabase
      .from('orders')
      .insert(orderData)
      .select()
      .single()
    
    if (error) throw new Error(`Erro ao criar encomenda: ${error.message}`)
    return data
  },

  async updateStatus(id: number, status: string): Promise<Order> {
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw new Error(`Erro ao atualizar estado da encomenda: ${error.message}`)
    return data
  }
}

// Order Items Operations
export const orderItemsService = {
  async getByOrderId(orderId: number): Promise<OrderItem[]> {
    const { data, error } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', orderId)
    
    if (error) throw new Error(`Erro ao buscar itens da encomenda: ${error.message}`)
    return data || []
  },

  async create(orderItemData: InsertOrderItem): Promise<OrderItem> {
    const { data, error } = await supabase
      .from('order_items')
      .insert(orderItemData)
      .select()
      .single()
    
    if (error) throw new Error(`Erro ao criar item da encomenda: ${error.message}`)
    return data
  }
}

// Contact Messages Operations
export const contactService = {
  async getAll(): Promise<ContactMessage[]> {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw new Error(`Erro ao buscar mensagens de contacto: ${error.message}`)
    return data || []
  },

  async create(messageData: InsertContactMessage): Promise<ContactMessage> {
    const { data, error } = await supabase
      .from('contact_messages')
      .insert(messageData)
      .select()
      .single()
    
    if (error) throw new Error(`Erro ao criar mensagem de contacto: ${error.message}`)
    return data
  },

  async markAsRead(id: number): Promise<ContactMessage> {
    const { data, error } = await supabase
      .from('contact_messages')
      .update({ status: 'read' })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw new Error(`Erro ao marcar mensagem como lida: ${error.message}`)
    return data
  }
}

// Analytics Events Operations
export const analyticsService = {
  async getAll(limit: number = 100): Promise<AnalyticsEvent[]> {
    const { data, error } = await supabase
      .from('analytics_events')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)
    
    if (error) throw new Error(`Erro ao buscar eventos analíticos: ${error.message}`)
    return data || []
  },

  async create(eventData: InsertAnalyticsEvent): Promise<AnalyticsEvent> {
    const { data, error } = await supabase
      .from('analytics_events')
      .insert(eventData)
      .select()
      .single()
    
    if (error) throw new Error(`Erro ao criar evento analítico: ${error.message}`)
    return data
  },

  async getByType(eventType: string): Promise<AnalyticsEvent[]> {
    const { data, error } = await supabase
      .from('analytics_events')
      .select('*')
      .eq('event_type', eventType)
      .order('created_at', { ascending: false })
    
    if (error) throw new Error(`Erro ao buscar eventos por tipo: ${error.message}`)
    return data || []
  }
}

// Fan Photos Operations
export const fanPhotosService = {
  async getAll(): Promise<FanPhoto[]> {
    const { data, error } = await supabase
      .from('fan_photos')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw new Error(`Erro ao buscar fotos de fãs: ${error.message}`)
    return data || []
  },

  async getApproved(): Promise<FanPhoto[]> {
    const { data, error } = await supabase
      .from('fan_photos')
      .select('*')
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
    
    if (error) throw new Error(`Erro ao buscar fotos aprovadas: ${error.message}`)
    return data || []
  },

  async getPending(): Promise<FanPhoto[]> {
    const { data, error } = await supabase
      .from('fan_photos')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
    
    if (error) throw new Error(`Erro ao buscar fotos pendentes: ${error.message}`)
    return data || []
  },

  async create(photoData: InsertFanPhoto): Promise<FanPhoto> {
    const { data, error } = await supabase
      .from('fan_photos')
      .insert(photoData)
      .select()
      .single()
    
    if (error) throw new Error(`Erro ao criar foto de fã: ${error.message}`)
    return data
  },

  async updateStatus(id: number, status: string, approvedBy?: string): Promise<FanPhoto> {
    const updateData: any = { status }
    if (approvedBy) updateData.approved_by = approvedBy
    
    const { data, error } = await supabase
      .from('fan_photos')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw new Error(`Erro ao atualizar estado da foto: ${error.message}`)
    return data
  },

  async delete(id: number): Promise<void> {
    const { error } = await supabase
      .from('fan_photos')
      .delete()
      .eq('id', id)
    
    if (error) throw new Error(`Erro ao eliminar foto: ${error.message}`)
  }
}

// Admin Users Operations
export const adminUsersService = {
  async getAll(): Promise<AdminUser[]> {
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw new Error(`Erro ao buscar utilizadores admin: ${error.message}`)
    return data || []
  },

  async getById(id: string): Promise<AdminUser | null> {
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error && error.code !== 'PGRST116') throw new Error(`Erro ao buscar utilizador admin: ${error.message}`)
    return data || null
  },

  async upsert(userData: UpsertAdminUser): Promise<AdminUser> {
    const { data, error } = await supabase
      .from('admin_users')
      .upsert(userData)
      .select()
      .single()
    
    if (error) throw new Error(`Erro ao criar/atualizar utilizador admin: ${error.message}`)
    return data
  }
}

// Database Stats for Admin Panel
export const statsService = {
  async getDashboardStats() {
    try {
      const [users, products, orders, messages, photos] = await Promise.all([
        usersService.getAll(),
        productsService.getAll(),
        ordersService.getAll(),
        contactService.getAll(),
        fanPhotosService.getAll()
      ])

      return {
        totalUsers: users.length,
        activeUsers: users.filter(u => u.isActive).length,
        totalProducts: products.length,
        activeProducts: products.filter(p => p.isActive).length,
        totalOrders: orders.length,
        pendingOrders: orders.filter(o => o.status === 'pending').length,
        unreadMessages: messages.filter(m => m.status === 'unread').length,
        pendingPhotos: photos.filter(p => p.status === 'pending').length,
        totalRevenue: orders.reduce((sum, order) => sum + parseFloat(order.total), 0)
      }
    } catch (error) {
      throw new Error(`Erro ao buscar estatísticas: ${error}`)
    }
  }
}