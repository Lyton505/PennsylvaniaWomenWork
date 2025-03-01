import mongoose from "mongoose";

// User schema definition
const userSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // ✅ Store Auth0 sub as _id
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  role: { type: String, required: true },
  workshopIDs: [String], // For mentors only
  menteeInfo: [String], // For mentors only
  meetingSchedule: [String], // For mentees only
  mentorData: String, // For mentees only
  meetings: [
    {
      name: String, // title
      notes: String,
      createdAt: { type: Date, default: Date.now },
    },
  ],
});

const User = mongoose.model("User", userSchema);

export default User;
