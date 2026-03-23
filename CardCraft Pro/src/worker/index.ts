import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

type Bindings = {
  DB: D1Database;
  R2_BUCKET: R2Bucket;
};

const app = new Hono<{ Bindings: Bindings }>();

// Middleware
app.use("*", cors({
  origin: ["http://localhost:5173", "https://your-domain.com"],
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization"],
}));

app.use("*", logger());

// Health check endpoint
app.get("/health", (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

// API routes
app.get("/api/users", (c) => {
  return c.json({ users: [] });
});

app.post("/api/users", async (c) => {
  const body = await c.req.json();
  return c.json({ message: "User created", user: body });
});

// Proxy external API if needed
app.all("/api/proxy/*", async (c) => {
  const targetUrl = c.req.path.replace("/api/proxy", "");
  const method = c.req.method;
  
  try {
    const response = await fetch(`https://external-api.com${targetUrl}`, {
      method,
      headers: c.req.header(),
      body: method !== "GET" ? await c.req.text() : undefined,
    });
    
    const data = await response.json();
    return c.json(data);
  } catch (error) {
    return c.json({ error: "Proxy failed" }, 500);
  }
});

export default app;
