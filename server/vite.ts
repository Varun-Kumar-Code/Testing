import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer, createLogger } from "vite";
import { type Server } from "http";
import viteConfig from "../vite.config";
import { nanoid } from "nanoid";
// When building the server bundle to CommonJS, `import.meta.url` is not available.
// Use process.cwd() to resolve project root at runtime which works in both dev
// (ESM) and production (CJS) builds.
// projectRoot is the repository root at runtime (works in both dev and built CJS)
const projectRoot = process.cwd();

const viteLogger = createLogger();

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      },
    },
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(projectRoot, "client", "index.html");
      // Log the resolved clientTemplate so deploy logs show where we read index.html from
      log(`projectRoot=${projectRoot}`, "startup");
      log(`clientTemplate=${clientTemplate}`, "startup");

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`,
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  const distPath = path.resolve(projectRoot, "dist", "public");
  // Log the resolved paths so Render logs reveal where the server expects static files
  log(`projectRoot=${projectRoot}`, "startup");
  log(`distPath=${distPath}`, "startup");

  if (!fs.existsSync(distPath)) {
    log(`distPath missing: ${distPath}`, "startup");
    // Provide a helpful directory listing for debugging
    try {
      const entries = fs.readdirSync(projectRoot);
      log(`projectRoot entries: ${entries.join(", ")}`, "startup");
    } catch (err) {
      log(`failed to read projectRoot contents: ${(err as Error).message}`, "startup");
    }
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
