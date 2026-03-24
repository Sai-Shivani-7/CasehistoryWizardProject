import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import centreRoutes    from "./routes/centre.routes.js";
import therapistRoutes from "./routes/therapist.routes.js";
import childRoutes     from "./routes/child.routes.js";
import caseRoutes      from "./routes/case.routes.js";

dotenv.config();

const app = express();

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
}));
app.use(express.json({ limit: "50mb" }));   // large for drawing path data
app.use(express.urlencoded({ extended: true }));

// ── Routes ────────────────────────────────────────────────────────────────────
app.use("/api/centres",    centreRoutes);
app.use("/api/therapists", therapistRoutes);
app.use("/api/children",   childRoutes);
app.use("/api/cases",      caseRoutes);

// Health check
app.get("/api/health", (_, res) => res.json({ status: "ok", time: new Date() }));

// 404
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// Global error handler
app.use((err, _req, res, _next) => {
  console.error("Server error:", err.message);
  res.status(err.status || 500).json({ message: err.message || "Internal Server Error" });
});

// ── Connect & Start ───────────────────────────────────────────────────────────
const PORT      = process.env.PORT      || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/casehistory";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log(`✅  MongoDB connected → ${MONGO_URI}`);
    app.listen(PORT, () =>
      console.log(`🚀  Backend running  → http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌  MongoDB connection failed:", err.message);
    process.exit(1);
  });
