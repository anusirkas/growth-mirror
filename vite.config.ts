import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

/**
 * Serves /api/reflect during `npm run dev` with the same handler Vercel runs
 * in production, so the AI flow works locally without the Vercel CLI.
 */
function apiInDev(): Plugin {
  return {
    name: "api-in-dev",
    configureServer(server) {
      // .env.local fills in what the shell hasn't set (tests blank the key on purpose)
      for (const [key, value] of Object.entries(loadEnv(server.config.mode, process.cwd(), ""))) {
        if (process.env[key] === undefined) process.env[key] = value;
      }
      server.middlewares.use("/api/reflect", async (req, res) => {
        const { defaultDeps, handleReflect } = await server.ssrLoadModule("/server/reflect.ts");
        const chunks: Buffer[] = [];
        for await (const chunk of req) chunks.push(chunk as Buffer);
        const request = new Request(`http://localhost${req.originalUrl ?? req.url}`, {
          method: req.method,
          headers: req.headers as Record<string, string>,
          body: req.method === "GET" || req.method === "HEAD" ? undefined : Buffer.concat(chunks),
        });
        const response: Response = await handleReflect(request, defaultDeps());
        res.statusCode = response.status;
        response.headers.forEach((value, key) => res.setHeader(key, value));
        res.end(await response.text());
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), apiInDev()],
});
