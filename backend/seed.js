/**
 * seed.js — run once to populate the DB with sample data
 *
 *   cd backend
 *   npm run seed
 *
 * Collections used (matching what already exists in your MongoDB):
 *   casehistory.centre
 *   casehistory.therapist
 *   casehistory.child
 */

import mongoose from "mongoose";
import dotenv from "dotenv";
import Centre    from "./models/Centre.js";
import Therapist from "./models/Therapist.js";
import Child     from "./models/Child.js";

dotenv.config();

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/casehistory";

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log("✅  Connected to MongoDB →", MONGO_URI);

  // ── Wipe existing data in these collections ──────────────────────────────
  await Centre.deleteMany({});
  await Therapist.deleteMany({});
  await Child.deleteMany({});
  console.log("🗑️   Cleared centre, therapist, child collections");

  // ── Centres ───────────────────────────────────────────────────────────────
  const [c1, c2] = await Centre.insertMany([
    { name: "Total Solutions – Hyderabad",     address: "Banjara Hills, Hyderabad",  phone: "040-12345678" },
    { name: "Total Solutions – Secunderabad",  address: "Secunderabad, Hyderabad",   phone: "040-87654321" },
  ]);
  console.log("🏢  Centres:", c1.name, "|", c2.name);

  // ── Therapists ────────────────────────────────────────────────────────────
  const [t1, t2, t3] = await Therapist.insertMany([
    { name: "Dr. Tejesh Kumar",  email: "tejesh@clinic.in",  phone: "9876543210", centreId: c1._id },
    { name: "Dr. Sravani Reddy", email: "sravani@clinic.in", phone: "9876543211", centreId: c1._id },
    { name: "Dr. Anand Prasad",  email: "anand@clinic.in",   phone: "9876543212", centreId: c2._id },
  ]);
  console.log("👩‍⚕️  Therapists:", t1.name, "|", t2.name, "|", t3.name);

  // ── Children ──────────────────────────────────────────────────────────────
  const kids = await Child.insertMany([
    { name: "Rahul Sharma",  dob: "2018-05-12", gender: "Male",   therapistId: t1._id, centreId: c1._id },
    { name: "Priya Patel",   dob: "2019-08-23", gender: "Female", therapistId: t1._id, centreId: c1._id },
    { name: "Arjun Reddy",   dob: "2017-11-04", gender: "Male",   therapistId: t2._id, centreId: c1._id },
    { name: "Sneha Verma",   dob: "2020-02-14", gender: "Female", therapistId: t2._id, centreId: c1._id },
    { name: "Karthik Rao",   dob: "2018-07-30", gender: "Male",   therapistId: t3._id, centreId: c2._id },
    { name: "Divya Nair",    dob: "2019-12-01", gender: "Female", therapistId: t3._id, centreId: c2._id },
    { name: "Rohit Gupta",   dob: "2016-09-18", gender: "Male",   therapistId: t1._id, centreId: c1._id },
    { name: "Ananya Singh",  dob: "2021-03-25", gender: "Female", therapistId: t2._id, centreId: c1._id },
  ]);
  console.log(`👶  ${kids.length} children seeded`);

  console.log("\n✅  Done! Start the backend and open http://localhost:5173");
  console.log("    The child dropdown should now show all 8 children.\n");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌  Seed error:", err.message);
  process.exit(1);
});
