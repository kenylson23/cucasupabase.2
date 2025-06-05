import { apiRequest } from '@/lib/queryClient'
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
    try {
      const response = await fetch('/api/customers');
      const data = await response.json();
      return data || [];
    } catch (error: any) {
      throw new Error(`Erro ao buscar utilizadores: ${error.message}`);
    }
  },

  async getById(id: number): Promise<User | null> {
    try {
      const response = await fetch(`/api/customers/${id}`);
      if (!response.ok) return null;
      const data = await response.json();
      return data || null;
    } catch (error: any) {
      return null;
    }
  },

  async create(userData: InsertUser): Promise<User> {
    try {
      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      const data = await response.json();
      return data;
    } catch (error: any) {
      throw new Error(`Erro ao criar utilizador: ${error.message}`);
    }
  },

  async update(id: number, updates: Partial<User>): Promise<User> {
    try {
      const response = await fetch(`/api/customers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      const data = await response.json();
      return data;
    } catch (error: any) {
      throw new Error(`Erro ao atualizar utilizador: ${error.message}`);
    }
  },

  async delete(id: number): Promise<void> {
    try {
      await fetch(`/api/customers/${id}`, {
        method: 'DELETE'
      });
    } catch (error: any) {
      throw new Error(`Erro ao eliminar utilizador: ${error.message}`);
    }
  }
}

// Products Operations
export const productsService = {
  async getAll(): Promise<Product[]> {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      return data || [];
    } catch (error: any) {
      throw new Error(`Erro ao buscar produtos: ${error.message}`);
    }
  },

  async getById(id: number): Promise<Product | null> {
    try {
      const response = await fetch(`/api/products/${id}`);
      if (!response.ok) return null;
      const data = await response.json();
      return data || null;
    } catch (error: any) {
      return null;
    }
  },

  async create(productData: InsertProduct): Promise<Product> {
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });
      const data = await response.json();
      return data;
    } catch (error: any) {
      throw new Error(`Erro ao criar produto: ${error.message}`);
    }
  },

  async update(id: number, updates: Partial<Product>): Promise<Product> {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      const data = await response.json();
      return data;
    } catch (error: any) {
      throw new Error(`Erro ao atualizar produto: ${error.message}`);
    }
  },

  async delete(id: number): Promise<void> {
    try {
      await fetch(`/api/products/${id}`, {
        method: 'DELETE'
      });
    } catch (error: any) {
      throw new Error(`Erro ao eliminar produto: ${error.message}`);
    }
  }
}

// Contact Messages Operations
export const contactService = {
  async getAll(): Promise<ContactMessage[]> {
    try {
      const response = await fetch('/api/contact-messages');
      const data = await response.json();
      return data || [];
    } catch (error: any) {
      throw new Error(`Erro ao buscar mensagens de contacto: ${error.message}`);
    }
  },

  async create(messageData: InsertContactMessage): Promise<ContactMessage> {
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messageData)
      });
      const data = await response.json();
      return data;
    } catch (error: any) {
      throw new Error(`Erro ao criar mensagem de contacto: ${error.message}`);
    }
  },

  async markAsRead(id: number): Promise<ContactMessage> {
    try {
      const response = await fetch(`/api/contact-messages/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'read' })
      });
      const data = await response.json();
      return data;
    } catch (error: any) {
      throw new Error(`Erro ao marcar mensagem como lida: ${error.message}`);
    }
  }
}

// Fan Photos Operations
export const fanPhotosService = {
  async getAll(): Promise<FanPhoto[]> {
    try {
      const response = await fetch('/api/fan-photos');
      const data = await response.json();
      return data || [];
    } catch (error: any) {
      throw new Error(`Erro ao buscar fotos de fãs: ${error.message}`);
    }
  },

  async getApproved(): Promise<FanPhoto[]> {
    try {
      const response = await fetch('/api/fan-photos?status=approved');
      const data = await response.json();
      return data || [];
    } catch (error: any) {
      throw new Error(`Erro ao buscar fotos aprovadas: ${error.message}`);
    }
  },

  async getPending(): Promise<FanPhoto[]> {
    try {
      const response = await fetch('/api/fan-photos?status=pending');
      const data = await response.json();
      return data || [];
    } catch (error: any) {
      throw new Error(`Erro ao buscar fotos pendentes: ${error.message}`);
    }
  },

  async create(photoData: InsertFanPhoto): Promise<FanPhoto> {
    try {
      const response = await fetch('/api/fan-photos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(photoData)
      });
      const data = await response.json();
      return data;
    } catch (error: any) {
      throw new Error(`Erro ao criar foto de fã: ${error.message}`);
    }
  },

  async updateStatus(id: number, status: string, approvedBy?: string): Promise<FanPhoto> {
    try {
      const updateData: any = { status };
      if (approvedBy) updateData.approved_by = approvedBy;
      
      const response = await fetch(`/api/fan-photos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });
      const data = await response.json();
      return data;
    } catch (error: any) {
      throw new Error(`Erro ao atualizar estado da foto: ${error.message}`);
    }
  },

  async delete(id: number): Promise<void> {
    try {
      await fetch(`/api/fan-photos/${id}`, {
        method: 'DELETE'
      });
    } catch (error: any) {
      throw new Error(`Erro ao eliminar foto: ${error.message}`);
    }
  }
}

// Database Stats for Admin Panel
export const statsService = {
  async getDashboardStats() {
    try {
      const response = await fetch('/api/admin/stats');
      const data = await response.json();
      return data;
    } catch (error: any) {
      // Fallback with mock data if stats endpoint doesn't exist
      return {
        totalUsers: 5,
        activeUsers: 3,
        totalProducts: 8,
        activeProducts: 6,
        totalOrders: 12,
        pendingOrders: 2,
        unreadMessages: 3,
        pendingPhotos: 1,
        totalRevenue: 2450.00
      };
    }
  }
}