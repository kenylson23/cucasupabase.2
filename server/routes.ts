import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertContactMessageSchema,
  insertProductSchema,
  insertOrderSchema,
  insertAnalyticsEventSchema 
} from "@shared/schema";
import { getSimpleSession, requireAuth, loginHandler, logoutHandler, getUserHandler, registerHandler } from "./simpleAuth";
import { seedDatabase } from "./seed";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize session middleware
  app.use(getSimpleSession());
  
  // Seed database on startup
  await seedDatabase();

  // Auth routes
  app.post('/api/auth/login', loginHandler);
  app.post('/api/auth/logout', logoutHandler);
  app.get('/api/auth/user', getUserHandler);

  // Contact form submission endpoint
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactMessageSchema.parse(req.body);
      const message = await storage.createContactMessage(validatedData);
      res.json({ success: true, message: "Mensagem enviada com sucesso!" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false, 
          message: "Dados inválidos", 
          errors: error.errors 
        });
      } else {
        res.status(500).json({ 
          success: false, 
          message: "Erro interno do servidor" 
        });
      }
    }
  });

  // Admin routes (protected)
  app.get("/api/admin/contact-messages", requireAuth, async (req, res) => {
    try {
      const messages = await storage.getContactMessages();
      res.json(messages);
    } catch (error) {
      console.error("Error fetching contact messages:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  app.patch("/api/admin/contact-messages/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const message = await storage.updateContactMessage(id, updates);
      res.json(message);
    } catch (error) {
      console.error("Error updating contact message:", error);
      res.status(500).json({ message: "Failed to update message" });
    }
  });

  // Product management routes
  app.get("/api/admin/products", requireAuth, async (req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getProducts();
      const activeProducts = products.filter(p => p.isActive);
      res.json(activeProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.post("/api/admin/products", requireAuth, async (req, res) => {
    try {
      const result = insertProductSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({
          message: "Invalid input",
          errors: result.error.issues,
        });
      }

      const product = await storage.createProduct(result.data);
      res.json(product);
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(500).json({ message: "Failed to create product" });
    }
  });

  app.patch("/api/admin/products/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const product = await storage.updateProduct(id, updates);
      res.json(product);
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({ message: "Failed to update product" });
    }
  });

  app.delete("/api/admin/products/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteProduct(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ message: "Failed to delete product" });
    }
  });

  // Customer management routes
  app.get("/api/admin/customers", requireAuth, async (req, res) => {
    try {
      const customers = await storage.getCustomers();
      res.json(customers);
    } catch (error) {
      console.error("Error fetching customers:", error);
      res.status(500).json({ message: "Failed to fetch customers" });
    }
  });

  app.patch("/api/admin/customers/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const customer = await storage.updateCustomer(id, updates);
      res.json(customer);
    } catch (error) {
      console.error("Error updating customer:", error);
      res.status(500).json({ message: "Failed to update customer" });
    }
  });

  // Order management routes
  app.get("/api/admin/orders", requireAuth, async (req, res) => {
    try {
      const orders = await storage.getOrders();
      res.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.patch("/api/admin/orders/:id/status", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      const order = await storage.updateOrderStatus(id, status);
      res.json(order);
    } catch (error) {
      console.error("Error updating order status:", error);
      res.status(500).json({ message: "Failed to update order status" });
    }
  });

  // Analytics routes
  app.post("/api/analytics", async (req, res) => {
    try {
      const result = insertAnalyticsEventSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({
          message: "Invalid input",
          errors: result.error.issues,
        });
      }

      const event = await storage.createAnalyticsEvent(result.data);
      res.json(event);
    } catch (error) {
      console.error("Error creating analytics event:", error);
      res.status(500).json({ message: "Failed to create analytics event" });
    }
  });

  app.get("/api/admin/analytics", requireAuth, async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;
      const events = await storage.getAnalyticsEvents(limit);
      res.json(events);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  // Dashboard stats
  app.get("/api/admin/stats", requireAuth, async (req, res) => {
    try {
      const [products, customers, orders, messages] = await Promise.all([
        storage.getProducts(),
        storage.getCustomers(),
        storage.getOrders(),
        storage.getContactMessages()
      ]);

      const stats = {
        totalProducts: products.length,
        activeProducts: products.filter(p => p.isActive).length,
        totalCustomers: customers.length,
        activeCustomers: customers.filter(c => c.isActive).length,
        totalOrders: orders.length,
        pendingOrders: orders.filter(o => o.status === 'pending').length,
        unreadMessages: messages.filter(m => m.status === 'unread').length,
        totalRevenue: orders
          .filter(o => o.paymentStatus === 'paid')
          .reduce((sum, o) => sum + parseFloat(o.total), 0)
      };

      res.json(stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
