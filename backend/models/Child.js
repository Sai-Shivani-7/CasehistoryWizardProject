import mongoose from "mongoose";

/**
 * Collection: children
 */
const childSchema = new mongoose.Schema(
  {
    name:        { type: String, required: true, trim: true },
    dob:         { type: String, default: "" },   // stored as YYYY-MM-DD string
    gender:      { type: String, enum: ["Male", "Female", "Other", ""], default: "" },
    therapistId: { type: mongoose.Schema.Types.ObjectId, ref: "Therapist", default: null },
    centreId:    { type: mongoose.Schema.Types.ObjectId, ref: "Centre",    default: null },
    isActive:    { type: Boolean, default: true },
  },
  { timestamps: true, collection: "child" }
);

export default mongoose.model("Child", childSchema);
