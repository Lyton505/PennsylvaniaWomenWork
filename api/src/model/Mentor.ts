import mongoose, { Schema, Document } from "mongoose";

// Interface for Mentor
interface IMentor extends Document {
  name: string;
  email: string;
  mentees: Schema.Types.ObjectId[]; // References to Mentee
  workshops: Schema.Types.ObjectId[]; // References to Workshop
}

// Mentor schema
const MentorSchema: Schema<IMentor> = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mentees: [{ type: Schema.Types.ObjectId, ref: "Mentee" }], // List of mentees
  workshops: [{ type: Schema.Types.ObjectId, ref: "Workshop" }], // List of workshops
});

const Mentor = mongoose.model<IMentor>("Mentor", MentorSchema);
export { Mentor, IMentor };
