import mongoose, { Schema, Document } from "mongoose";

// Interface for Mentee
interface IMentee extends Document {
  name: string;
  email: string;
  mentor: Schema.Types.ObjectId; // Reference to Mentor
  workshops: Schema.Types.ObjectId[]; // References to Workshop
}

// Mentee schema
const MenteeSchema: Schema<IMentee> = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mentor: { type: Schema.Types.ObjectId, ref: "Mentor", required: true }, // Single mentor
  workshops: [{ type: Schema.Types.ObjectId, ref: "Workshop" }], // List of workshops
});

const Mentee = mongoose.model<IMentee>("Mentee", MenteeSchema);
export { Mentee, IMentee };
