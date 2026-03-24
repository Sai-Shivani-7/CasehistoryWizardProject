import mongoose from "mongoose";

/**
 * Collection: centres
 * Represents a therapy / rehabilitation centre.
 */
const centreSchema = new mongoose.Schema(
  {
    name:    { type: String, required: true, trim: true, unique: true },
    address: { type: String, default: "" },
    phone:   { type: String, default: "" },
    email:   { type: String, default: "" },
  },
  { timestamps: true, collection: "centre" }
);

export default mongoose.model("Centre", centreSchema);
