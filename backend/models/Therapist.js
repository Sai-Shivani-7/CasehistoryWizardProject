import mongoose from "mongoose";

/**
 * Collection: therapists
 */
const therapistSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true, trim: true },
    email:    { type: String, default: "", trim: true },
    phone:    { type: String, default: "" },
    centreId: { type: mongoose.Schema.Types.ObjectId, ref: "Centre", default: null },
  },
  { timestamps: true, collection: "therapist" }
);

export default mongoose.model("Therapist", therapistSchema);
