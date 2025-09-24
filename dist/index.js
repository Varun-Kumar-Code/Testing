"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server/index.ts
var import_express2 = __toESM(require("express"));

// server/routes.ts
var import_http = require("http");

// server/storage.ts
var import_crypto = require("crypto");
var MemStorage = class {
  users;
  products;
  constructor() {
    this.users = /* @__PURE__ */ new Map();
    this.products = /* @__PURE__ */ new Map();
    this.seedProducts();
  }
  seedProducts() {
    const sampleProducts = [
      {
        name: "Serum",
        description: "Lorem ipsum dolor",
        price: 1750,
        category: "Pottery",
        imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        rating: 4,
        isFavorite: false
      },
      {
        name: "Vuozi",
        description: "Lorem ipsum dolor",
        price: 3845,
        category: "Ceramic",
        imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        rating: 4,
        isFavorite: false
      },
      {
        name: "Lorem",
        description: "Lorem ipsum dolor",
        price: 3574,
        category: "Pottery",
        imageUrl: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        rating: 4,
        isFavorite: true
      },
      {
        name: "Lorem",
        description: "Lorem ipsum dolor",
        price: 2499,
        category: "Ceramic",
        imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        rating: 4,
        isFavorite: false
      },
      {
        name: "Tiles",
        description: "Lorem ipsum dolor",
        price: 1890,
        category: "Glaze",
        imageUrl: "https://images.unsplash.com/photo-1582582621959-48d27397dc69?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        rating: 4,
        isFavorite: false
      },
      {
        name: "Bowl",
        description: "Lorem ipsum dolor",
        price: 1250,
        category: "Pottery",
        imageUrl: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        rating: 4,
        isFavorite: false
      },
      {
        name: "Serum",
        description: "Lorem ipsum dolor",
        price: 1750,
        category: "Pottery",
        imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        rating: 4,
        isFavorite: false
      },
      {
        name: "Vuozi",
        description: "Lorem ipsum dolor",
        price: 3845,
        category: "Ceramic",
        imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        rating: 4,
        isFavorite: false
      },
      {
        name: "Lorem",
        description: "Lorem ipsum dolor",
        price: 3574,
        category: "Pottery",
        imageUrl: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        rating: 4,
        isFavorite: true
      },
      {
        name: "Lorem",
        description: "Lorem ipsum dolor",
        price: 2499,
        category: "Ceramic",
        imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        rating: 4,
        isFavorite: false
      },
      {
        name: "Tiles",
        description: "Lorem ipsum dolor",
        price: 1890,
        category: "Glaze",
        imageUrl: "https://images.unsplash.com/photo-1582582621959-48d27397dc69?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        rating: 4,
        isFavorite: false
      },
      {
        name: "Bowl",
        description: "Lorem ipsum dolor",
        price: 1250,
        category: "Pottery",
        imageUrl: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        rating: 4,
        isFavorite: false
      }
    ];
    sampleProducts.forEach((product) => {
      const id = (0, import_crypto.randomUUID)();
      const fullProduct = {
        ...product,
        id,
        rating: product.rating ?? 4,
        isFavorite: product.isFavorite ?? false
      };
      this.products.set(id, fullProduct);
    });
  }
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByUsername(username) {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  async createUser(insertUser) {
    const id = (0, import_crypto.randomUUID)();
    const user = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  async getProducts() {
    return Array.from(this.products.values());
  }
  async getProductsByCategory(category) {
    if (category === "All") {
      return this.getProducts();
    }
    return Array.from(this.products.values()).filter(
      (product) => product.category === category
    );
  }
  async getProduct(id) {
    return this.products.get(id);
  }
  async createProduct(insertProduct) {
    const id = (0, import_crypto.randomUUID)();
    const product = {
      ...insertProduct,
      id,
      rating: insertProduct.rating ?? 4,
      isFavorite: insertProduct.isFavorite ?? false
    };
    this.products.set(id, product);
    return product;
  }
  async toggleProductFavorite(id) {
    const product = this.products.get(id);
    if (product) {
      const updatedProduct = { ...product, isFavorite: !product.isFavorite };
      this.products.set(id, updatedProduct);
      return updatedProduct;
    }
    return void 0;
  }
};
var storage = new MemStorage();

// shared/schema.ts
var import_drizzle_orm = require("drizzle-orm");
var import_pg_core = require("drizzle-orm/pg-core");
var import_drizzle_zod = require("drizzle-zod");
var users = (0, import_pg_core.pgTable)("users", {
  id: (0, import_pg_core.varchar)("id").primaryKey().default(import_drizzle_orm.sql`gen_random_uuid()`),
  username: (0, import_pg_core.text)("username").notNull().unique(),
  password: (0, import_pg_core.text)("password").notNull()
});
var products = (0, import_pg_core.pgTable)("products", {
  id: (0, import_pg_core.varchar)("id").primaryKey().default(import_drizzle_orm.sql`gen_random_uuid()`),
  name: (0, import_pg_core.text)("name").notNull(),
  description: (0, import_pg_core.text)("description").notNull(),
  price: (0, import_pg_core.integer)("price").notNull(),
  // Price in cents/paise
  category: (0, import_pg_core.text)("category").notNull(),
  imageUrl: (0, import_pg_core.text)("image_url").notNull(),
  rating: (0, import_pg_core.integer)("rating").notNull().default(4),
  // Rating out of 5
  isFavorite: (0, import_pg_core.boolean)("is_favorite").notNull().default(false)
});
var insertUserSchema = (0, import_drizzle_zod.createInsertSchema)(users).pick({
  username: true,
  password: true
});
var insertProductSchema = (0, import_drizzle_zod.createInsertSchema)(products).omit({
  id: true
});

// server/routes.ts
var import_zod = require("zod");
async function registerRoutes(app2) {
  app2.get("/api/products", async (req, res) => {
    try {
      const category = req.query.category;
      const products2 = category ? await storage.getProductsByCategory(category) : await storage.getProducts();
      res.json(products2);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });
  app2.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });
  app2.patch("/api/products/:id/favorite", async (req, res) => {
    try {
      const product = await storage.toggleProductFavorite(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      console.error("Error toggling favorite:", error);
      res.status(500).json({ message: "Failed to toggle favorite" });
    }
  });
  app2.post("/api/products", async (req, res) => {
    try {
      const validatedProduct = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(validatedProduct);
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof import_zod.z.ZodError) {
        return res.status(400).json({ message: "Invalid product data", errors: error.errors });
      }
      console.error("Error creating product:", error);
      res.status(500).json({ message: "Failed to create product" });
    }
  });
  const httpServer = (0, import_http.createServer)(app2);
  return httpServer;
}

// server/vite.ts
var import_express = __toESM(require("express"));
var import_fs = __toESM(require("fs"));
var import_path2 = __toESM(require("path"));
var import_vite2 = require("vite");

// vite.config.ts
var import_vite = require("vite");
var import_plugin_react = __toESM(require("@vitejs/plugin-react"));
var import_path = __toESM(require("path"));
var __dirname = process.cwd();
var vite_config_default = (0, import_vite.defineConfig)({
  plugins: [(0, import_plugin_react.default)()],
  resolve: {
    alias: {
      "@": import_path.default.resolve(__dirname, "client", "src"),
      "@shared": import_path.default.resolve(__dirname, "shared"),
      "@assets": import_path.default.resolve(__dirname, "attached_assets")
    }
  },
  root: import_path.default.resolve(__dirname, "client"),
  build: {
    outDir: import_path.default.resolve(__dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
var import_nanoid = require("nanoid");
var __dirname2 = process.cwd();
var viteLogger = (0, import_vite2.createLogger)();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await (0, import_vite2.createServer)({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = import_path2.default.resolve(__dirname2, "client", "index.html");
      let template = await import_fs.default.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${(0, import_nanoid.nanoid)()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = import_path2.default.resolve(__dirname2, "dist", "public");
  if (!import_fs.default.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(import_express.default.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(import_path2.default.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = (0, import_express2.default)();
app.use(import_express2.default.json());
app.use(import_express2.default.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  const bindHost = process.env.HOST || (process.env.NODE_ENV === "production" ? "0.0.0.0" : "localhost");
  server.listen(port, bindHost, () => {
    const publicHost = bindHost === "0.0.0.0" ? "localhost" : bindHost;
    log(`serving on http://${publicHost}:${port}`);
  });
})();
