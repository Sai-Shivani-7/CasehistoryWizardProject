import { Router } from "express";
import Child from "../models/Child.js";

const router = Router();

// GET /api/children  — frontend dropdown calls this
router.get("/", async (_req, res) => {
  try {
    const children = await Child.find({ isActive: true })
      .populate("therapistId", "name email phone")
      .populate("centreId",    "name address")
      .sort({ name: 1 });
    res.json(children);
  } catch (err) {
    console.error("GET /api/children error:", err.message);
    res.status(500).json({ message: err.message });
  }
});

// POST /api/children  — create a new child
router.post("/", async (req, res) => {
  try {
    const { name, dob, gender, therapistId, centreId } = req.body;
    if (!name) return res.status(400).json({ message: "name is required" });

    const child = await Child.create({
      name,
      dob:         dob        || "",
      gender:      gender     || "",
      therapistId: therapistId || null,
      centreId:    centreId   || null,
    });
    await child.populate([
      { path: "therapistId", select: "name email" },
      { path: "centreId",    select: "name" },
    ]);
    res.status(201).json(child);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET /api/children/:id
router.get("/:id", async (req, res) => {
  try {
    const child = await Child.findById(req.params.id)
      .populate("therapistId", "name email phone")
      .populate("centreId",    "name address");
    if (!child) return res.status(404).json({ message: "Child not found" });
    res.json(child);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/children/:id
router.put("/:id", async (req, res) => {
  try {
    const child = await Child.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate("therapistId", "name email")
      .populate("centreId",    "name");
    if (!child) return res.status(404).json({ message: "Child not found" });
    res.json(child);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/children/:id  — soft delete
router.delete("/:id", async (req, res) => {
  try {
    await Child.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ message: "Child deactivated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
