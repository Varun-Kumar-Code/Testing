import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
// Avoid using `import.meta.url` because the server is bundled to CJS by esbuild.
// Use process.cwd() as the project root which works for both dev and production.
const __dirname = process.cwd();

export default defineConfig({
  plugins: [
    react(),
    // Remove Replit-specific plugins for Vercel deployment
    // ...(process.env.NODE_ENV !== "production" &&
    // process.env.REPL_ID !== undefined
    //   ? [
    //       await import("@replit/vite-plugin-cartographer").then((m) =>
    //         m.cartographer(),
    //       ),
    //     ]
    //   : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets"),
    },
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
