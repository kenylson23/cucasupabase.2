import type { RequestHandler } from "express";
import session from "express-session";
import connectPg from "connect-pg-simple";

// Simple admin credentials
const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "cuca2024"
};

export function getSimpleSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: true,
    ttl: sessionTtl,
    tableName: "admin_sessions",
  });

  return session({
    secret: process.env.SESSION_SECRET || "cuca-admin-secret-key-2024",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // Set to true in production with HTTPS
      maxAge: sessionTtl,
    },
  });
}

export const requireAuth: RequestHandler = (req, res, next) => {
  if (req.session && (req.session as any).isAuthenticated) {
    return next();
  }
  return res.status(401).json({ message: "Unauthorized" });
};

export const loginHandler: RequestHandler = (req, res) => {
  const { username, password } = req.body;

  if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
    (req.session as any).isAuthenticated = true;
    (req.session as any).user = {
      id: "admin-1",
      username: "admin",
      email: "admin@cuca.ao",
      firstName: "Admin",
      lastName: "CUCA",
      role: "admin"
    };
    
    res.json({ 
      success: true, 
      message: "Login realizado com sucesso",
      user: (req.session as any).user
    });
  } else {
    res.status(401).json({ 
      success: false, 
      message: "Credenciais inválidas" 
    });
  }
};

export const logoutHandler: RequestHandler = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Erro ao fazer logout" });
    }
    res.clearCookie('connect.sid');
    res.json({ success: true, message: "Logout realizado com sucesso" });
  });
};

export const getUserHandler: RequestHandler = (req, res) => {
  if (req.session && (req.session as any).isAuthenticated) {
    res.json((req.session as any).user);
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
};