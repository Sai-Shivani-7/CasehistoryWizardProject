import { Router } from "express";
import Case  from "../models/Case.js";
import Child from "../models/Child.js";
import { verifyToken } from "../middleware/auth.js";

const router = Router();
router.use(verifyToken);

// ── POST /api/cases ───────────────────────────────────────────────────────────
// Called by handleSave in CaseHistoryWizard — saves all 8 steps at once.
router.post("/", async (req, res) => {
  try {
    const {
      childId,
      demographics,
      documentsChecklist,
      increasingBehaviourPlan,
      decreasingBehaviourPlan,
      trialExamination,
      visualShapes,
      assessmentNotes,
      medicalHistory,
    } = req.body;

    if (!childId) {
      return res.status(400).json({ message: "childId is required" });
    }

    const child = await Child.findById(childId);
    if (!child) {
      return res.status(404).json({ message: "Child not found" });
    }

    const caseDoc = await Case.create({
      childId,
      demographics,
      documentsChecklist,
      increasingBehaviourPlan,
      decreasingBehaviourPlan,
      trialExamination,
      visualShapes,
      assessmentNotes,
      medicalHistory,
    });

    res.status(201).json(caseDoc);
  } catch (err) {
    console.error("POST /api/cases error:", err.message);
    res.status(500).json({ message: err.message });
  }
});

// ── GET /api/cases/child/:childId ─────────────────────────────────────────────
// Called by fetchSavedHistories — returns all past histories for a child.
// Must be declared BEFORE /:id so it isn't shadowed.
router.get("/child/:childId", async (req, res) => {
  try {
    const cases = await Case.find({ childId: req.params.childId })
      .sort({ createdAt: -1 });
    res.json(cases);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET /api/cases ────────────────────────────────────────────────────────────
// All cases (paginated) — useful for admin views.
router.get("/", async (req, res) => {
  try {
    const page  = Math.max(1, parseInt(req.query.page)  || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 20);
    const skip  = (page - 1) * limit;

    const [cases, total] = await Promise.all([
      Case.find()
        .populate("childId", "name dob")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Case.countDocuments(),
    ]);

    res.json({ data: cases, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET /api/cases/:id ────────────────────────────────────────────────────────
// Single case by its own _id.
router.get("/:id", async (req, res) => {
  try {
    const caseDoc = await Case.findById(req.params.id)
      .populate("childId", "name dob gender");
    if (!caseDoc) return res.status(404).json({ message: "Case not found" });
    res.json(caseDoc);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── PUT /api/cases/:id ────────────────────────────────────────────────────────
router.put("/:id", async (req, res) => {
  try {
    const caseDoc = await Case.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!caseDoc) return res.status(404).json({ message: "Case not found" });
    res.json(caseDoc);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── DELETE /api/cases/:id ─────────────────────────────────────────────────────
router.delete("/:id", async (req, res) => {
  try {
    await Case.findByIdAndDelete(req.params.id);
    res.json({ message: "Case deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
