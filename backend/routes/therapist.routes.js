import { Router } from "express";
import Therapist from "../models/Therapist.js";

const router = Router();

// GET /api/therapists
router.get("/", async (_req, res) => {
  try {
    const therapists = await Therapist.find()
      .populate("centreId", "name")
      .sort({ name: 1 });
    res.json(therapists);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/therapists
router.post("/", async (req, res) => {
  try {
    const therapist = await Therapist.create(req.body);
    await therapist.populate("centreId", "name");
    res.status(201).json(therapist);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET /api/therapists/:id
router.get("/:id", async (req, res) => {
  try {
    const t = await Therapist.findById(req.params.id).populate("centreId", "name");
    if (!t) return res.status(404).json({ message: "Therapist not found" });
    res.json(t);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/therapists/:id
router.put("/:id", async (req, res) => {
  try {
    const t = await Therapist.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate("centreId", "name");
    if (!t) return res.status(404).json({ message: "Therapist not found" });
    res.json(t);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/therapists/:id
router.delete("/:id", async (req, res) => {
  try {
    await Therapist.findByIdAndDelete(req.params.id);
    res.json({ message: "Therapist deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
