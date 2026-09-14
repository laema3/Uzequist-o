import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(process.cwd(), 'server_data.json');

app.use(express.json({ limit: '50mb' }));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/data", (req, res) => {
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf-8');
      res.json(JSON.parse(data));
    } else {
      res.json(null);
    }
  } catch (err) {
    console.error("Error reading data:", err);
    res.status(500).json({ error: "Failed to read data" });
  }
});

app.post("/api/data", (req, res) => {
  try {
    const { profile, topics, videos, members } = req.body;
    const payload = { profile, topics, videos, members, updatedAt: new Date().toISOString() };
    fs.writeFileSync(DATA_FILE, JSON.stringify(payload, null, 2), 'utf-8');
    res.json({ success: true });
  } catch (err) {
    console.error("Error saving data:", err);
    res.status(500).json({ error: "Failed to save data" });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
