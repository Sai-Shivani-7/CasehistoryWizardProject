import mongoose from "mongoose";

/**
 * Collection: cases
 * One document = one complete 8-step wizard submission for a child.
 */

// ── sub-schemas (all _id:false to keep documents clean) ──────────────────────

const therapyEntrySchema = new mongoose.Schema(
  { type: String, startedDate: String, therapistName: String, uploadRef: String },
  { _id: false }
);

const demographicsSchema = new mongoose.Schema(
  {
    childName: String, dob: String, dateOfJoining: String,
    therapistName: String, centre: String,
    fatherName: String, fatherPhone: String, fatherWhatsApp: String, fatherEmail: String,
    motherName: String, motherPhone: String, motherWhatsApp: String, motherEmail: String,
    address: String, preTherapyVideoRef: String,
    newTherapyAdded: String, newTherapyDate: String, newTherapistName: String,
    therapyStarted: [therapyEntrySchema],
  },
  { _id: false }
);

const documentsChecklistSchema = new mongoose.Schema(
  {
    consultationPaper:   { type: Boolean, default: false },
    previousMedicalDocs: { type: Boolean, default: false },
    testReports:         { type: Boolean, default: false },
    consentForm:         { type: Boolean, default: false },
    parentConcerns:      { type: Boolean, default: false },
    parentConcernsText:  { type: String,  default: "" },
    therapyChange:       { type: Boolean, default: false },
    therapistChange:     { type: Boolean, default: false },
    foodAllergy:         { type: Boolean, default: false },
  },
  { _id: false }
);

const shortTermGoalSchema = new mongoose.Schema(
  { text: String, month1: String, month2: String, month3: String },
  { _id: false }
);

const increasingBehaviourPlanSchema = new mongoose.Schema(
  {
    longTermGoal:        String,
    shortTermGoals:      [shortTermGoalSchema],
    materialUsed:        String,
    methodsUsed:         String,
    parentalInvolvement: String,
    overallFeedback:     String,
  },
  { _id: false }
);

const decreasingRowSchema = new mongoose.Schema(
  { type: String, month1: String, month2: String, month3: String },
  { _id: false }
);

const decreasingBehaviourPlanSchema = new mongoose.Schema(
  {
    rows:                  [decreasingRowSchema],
    rewardsForConsequences: String,
    methodsUsed:            String,
    parentalInvolvement:    String,
  },
  { _id: false }
);

const trialSchema = new mongoose.Schema(
  { promptUsed: String, maxScore: mongoose.Schema.Types.Mixed, achievedScore: mongoose.Schema.Types.Mixed },
  { _id: false }
);

const trialExaminationSchema = new mongoose.Schema(
  {
    targetBehaviour: String,
    trials:          [trialSchema],
    totalScore:      { type: Number, default: 0 },
    percentage:      { type: Number, default: 0 },
  },
  { _id: false }
);

const visualShapesSchema = new mongoose.Schema(
  { childName: String, date: String },
  { _id: false }
);

const assessmentNotesSchema = new mongoose.Schema(
  {
    cylinderResult:    String,
    cubeResult:        String,
    rectangleResponse: String,
    therapistNotes:    String,
    observationNotes:  String,
    assessmentDate:    String,
  },
  { _id: false }
);

const medicalHistorySchema = new mongoose.Schema(
  {
    generalHistory:   String,
    prenatalHistory:  String,
    natalHistory:     String,
    postnatalHistory: String,
  },
  { _id: false }
);

// ── Root schema ───────────────────────────────────────────────────────────────

const caseSchema = new mongoose.Schema(
  {
    childId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      "Child",
      required: [true, "childId is required"],
      index:    true,
    },
    demographics:            demographicsSchema,
    documentsChecklist:      documentsChecklistSchema,
    increasingBehaviourPlan: increasingBehaviourPlanSchema,
    decreasingBehaviourPlan: decreasingBehaviourPlanSchema,
    trialExamination:        trialExaminationSchema,
    visualShapes:            visualShapesSchema,
    assessmentNotes:         assessmentNotesSchema,
    medicalHistory:          medicalHistorySchema,
  },
  { timestamps: true, collection: "case" }
);

export default mongoose.model("Case", caseSchema);
