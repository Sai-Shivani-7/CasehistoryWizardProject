import { Router } from "express";
import Centre from "../models/Centre.js";

const router = Router();

// GET /api/centres
router.get("/", async (_req, res) => {
  try {
    const centres = await Centre.find().sort({ name: 1 });
    res.json(centres);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/centres
router.post("/", async (req, res) => {
  try {
    const centre = await Centre.create(req.body);
    res.status(201).json(centre);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET /api/centres/:id
router.get("/:id", async (req, res) => {
  try {
    const centre = await Centre.findById(req.params.id);
    if (!centre) return res.status(404).json({ message: "Centre not found" });
    res.json(centre);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/centres/:id
router.put("/:id", async (req, res) => {
  try {
    const centre = await Centre.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!centre) return res.status(404).json({ message: "Centre not found" });
    res.json(centre);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/centres/:id
router.delete("/:id", async (req, res) => {
  try {
    await Centre.findByIdAndDelete(req.params.id);
    res.json({ message: "Centre deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
