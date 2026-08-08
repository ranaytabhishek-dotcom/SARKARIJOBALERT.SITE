import express from "express";
import path from "path";
import fs from "fs/promises";
// @ts-ignore
import archiver from "archiver";
import { createServer as createViteServer } from "vite";
import { v4 as uuidv4 } from "uuid";

const DATA_FILE = path.join(process.cwd(), "data.json");
const PORT = 3000;
const ADMIN_ID = "9389927711";
const ADMIN_PASS = "AiwaJaat@11";
const ADMIN_TOKEN = "admin_secret_token_123";

async function readData() {
  try {
    const data = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return { posts: [], settings: { adScript: "", adDelay: 5 } };
  }
}

async function writeData(data: any) {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // Simple auth middleware for protected routes
  const requireAdmin = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const token = req.headers.authorization;
    if (token === `Bearer ${ADMIN_TOKEN}`) {
      next();
    } else {
      res.status(401).json({ error: "Unauthorized" });
    }
  };

  // Auth Endpoint
  app.post("/api/auth", (req, res) => {
    const { id, password } = req.body;
    if (id === ADMIN_ID && password === ADMIN_PASS) {
      res.json({ token: ADMIN_TOKEN });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  });

  // Data Endpoints
  app.get("/api/posts", async (req, res) => {
    const data = await readData();
    // Sort by createdAt descending
    const posts = data.posts.sort((a: any, b: any) => b.createdAt - a.createdAt);
    res.json(posts);
  });

  app.get("/api/posts/:id", async (req, res) => {
    const data = await readData();
    const post = data.posts.find((p: any) => p.id === req.params.id);
    if (post) res.json(post);
    else res.status(404).json({ error: "Not found" });
  });

  app.post("/api/posts", requireAdmin, async (req, res) => {
    const data = await readData();
    const newPost = {
      ...req.body,
      id: uuidv4(),
      createdAt: Date.now()
    };
    data.posts.push(newPost);
    await writeData(data);
    res.json(newPost);
  });

  app.put("/api/posts/:id", requireAdmin, async (req, res) => {
    const data = await readData();
    const index = data.posts.findIndex((p: any) => p.id === req.params.id);
    if (index !== -1) {
      data.posts[index] = { ...data.posts[index], ...req.body };
      await writeData(data);
      res.json(data.posts[index]);
    } else {
      res.status(404).json({ error: "Not found" });
    }
  });

  app.delete("/api/posts/:id", requireAdmin, async (req, res) => {
    const data = await readData();
    data.posts = data.posts.filter((p: any) => p.id !== req.params.id);
    await writeData(data);
    res.json({ success: true });
  });

  app.get("/api/settings", async (req, res) => {
    const data = await readData();
    res.json(data.settings);
  });

  app.put("/api/settings", requireAdmin, async (req, res) => {
    const data = await readData();
    data.settings = { ...data.settings, ...req.body };
    await writeData(data);
    res.json(data.settings);
  });

  // Traffic tracking endpoint
  app.post("/api/track", async (req, res) => {
    // Filter out basic bots
    const userAgent = req.headers['user-agent'] || '';
    const isBot = /bot|crawler|spider|crawling|postman|curl/i.test(userAgent);
    
    if (isBot) {
      return res.json({ success: true, ignored: true });
    }

    const data = await readData();
    if (!data.traffic) data.traffic = [];
    
    // Create current date string in YYYY-MM-DD
    const today = new Date().toISOString().split('T')[0];
    const todayStat = data.traffic.find((t: any) => t.date === today);
    
    if (todayStat) {
      todayStat.views += 1;
    } else {
      data.traffic.push({ date: today, views: 1 });
    }
    
    await writeData(data);
    res.json({ success: true });
  });

  // Get traffic stats (admin only)
  app.get("/api/traffic", requireAdmin, async (req, res) => {
    const data = await readData();
    res.json(data.traffic || []);
  });

  // Public traffic stats for footer
  app.get("/api/public-traffic", async (req, res) => {
    const data = await readData();
    const traffic = data.traffic || [];
    
    const today = new Date().toISOString().split('T')[0];
    const todayStat = traffic.find((t: any) => t.date === today);
    const todayViews = todayStat ? todayStat.views : 0;
    
    const totalViews = traffic.reduce((acc: number, t: any) => acc + t.views, 0);
    
    res.json({ today: todayViews, total: totalViews });
  });

  app.get("/robots.txt", async (req, res) => {
    const data = await readData();
    const domain = data.settings?.siteDomain || "sarkarijobalert.site";
    const content = `User-agent: *\nAllow: /\nSitemap: https://${domain}/sitemap.xml`;
    res.type("text/plain");
    res.send(content);
  });

  app.get("/sitemap.xml", async (req, res) => {
    const data = await readData();
    const domain = data.settings?.siteDomain || "sarkarijobalert.site";
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
    
    // Add static pages
    const staticPages = ['', '/about', '/contact', '/privacy', '/disclaimer'];
    for (const page of staticPages) {
      xml += `\n  <url>\n    <loc>https://${domain}${page}</loc>\n    <changefreq>daily</changefreq>\n    <priority>${page === '' ? '1.0' : '0.8'}</priority>\n  </url>`;
    }
    
    // Add job pages
    if (data.posts) {
      for (const post of data.posts) {
        xml += `\n  <url>\n    <loc>https://${domain}/job/${post.id}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>`;
      }
    }
    
    xml += `\n</urlset>`;
    res.type("application/xml");
    res.send(xml);
  });

  app.get("/api/export-zip", (req, res) => {
    res.attachment("sarkarijobalert-source.zip");
    const archive = archiver("zip", {
      zlib: { level: 9 } // Sets the compression level.
    });

    archive.on("error", (err) => {
      res.status(500).send({ error: err.message });
    });

    archive.pipe(res);

    archive.glob("**/*", {
      cwd: process.cwd(),
      ignore: ["node_modules/**", "dist/**", ".git/**", ".npm/**", "sarkarijobalert-source.zip"]
    });

    archive.finalize();
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // For Express 4.x, this must be `*`. We have Express 4.21.2.
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
