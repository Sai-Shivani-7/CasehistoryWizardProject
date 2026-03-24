import { Router } from "express";
import Child from "../models/Child.js";
import { generateChildToken, verifyToken } from "../middleware/auth.js";

const router = Router();

// POST /api/auth/login/child { childId }
router.post("/login/child", async (req, res) => {
  const { childId } = req.body;
  if (!childId) return res.status(400).json({ message: "childId is required" });

  try {
    const child = await Child.findById(childId);
    if (!child || !child.isActive) {
      return res.status(404).json({ message: "Child not found or inactive" });
    }

    const token = generateChildToken(child);
    res.json({ token, child: { _id: child._id, name: child.name } });
  } catch (err) {
    console.error("POST /api/auth/login/child error:", err.message);
    res.status(500).json({ message: err.message });
  }
});

// GET /api/auth/verify
router.get("/verify", verifyToken, (req, res) => {
  res.json({ message: "verified", user: req.user });
});

export default router;
