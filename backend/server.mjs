// backend/server.mjs
import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";

// routers
import expensesRouter from "./routes/expenses.mjs";
import devRouter from "./routes/dev.mjs";

// utils para arquivos estáticos (/public/test.html)
import path, { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

// --- crie o app ANTES de usar app.use ---
const app = express();

// middlewares básicos
app.use(cors());
app.use(express.json());

// servir /public e /test
app.use(express.static(path.join(__dirname, "public")));
app.get("/test", (req, res) =>
  res.sendFile(path.join(__dirname, "public", "test.html"))
);

// healthcheck
app.get("/api/health", (req, res) =>
  res.json({ ok: true, uptime: process.uptime() })
);

// rotas principais (depois do app existir)
app.use("/api/expenses", expensesRouter);

// rotas de desenvolvimento
if (process.env.NODE_ENV !== "production") {
  app.use("/api/dev", devRouter);
}

// 404 e handler de erro
app.use((req, res) => res.status(404).json({ error: "Not found" }));
app.use((err, req, res, next) => {
  console.error(err);
  if (err.name === "ValidationError")
    return res.status(400).json({ error: err.message });
  res.status(500).json({ error: "Server error" });
});

// inicialização
const { PORT = 5050, MONGODB_URI } = process.env;

async function start() {
  try {
    if (!MONGODB_URI) throw new Error("MONGODB_URI missing in .env");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ MongoDB connected");
    app.listen(PORT, () =>
      console.log(`🚀 API running on http://localhost:${PORT}`)
    );
  } catch (e) {
    console.error("Startup error:", e.message);
    process.exit(1);
  }
}

start();
