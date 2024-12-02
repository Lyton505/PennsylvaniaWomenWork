import mongoose from "mongoose";

// User schema definition
const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  username: String,
  email: String,
  role: { type: String, enum: ["mentor", "mentee", "admin"], required: true },
  workshopIDs: [String], // For mentors only
  menteeInfo: [String], // For mentors only
  meetingSchedule: [String], // For mentees only
  mentorData: String, // For mentees only
});

const User = mongoose.model("User", userSchema);

export default User;