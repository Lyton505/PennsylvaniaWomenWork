import express from "express";
import mongoose from "mongoose";
import dbConnect from "../config/db";
import { validateAccessToken } from "../controllers/auth0-middleware";

const router = express.Router();

router.use(validateAccessToken);

// Call the dbConnect function to connect to MongoDB
dbConnect();

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

// Route to create a new user
router.post("/create-user", async (req: any, res: any) => {
  const {
    firstName,
    lastName,
    username,
    email,
    role,
    workshopIDs,
    menteeInfo,
    meetingSchedule,
    mentorData,
  } = req.body;

  if (!firstName || !lastName || !username || !email || !role) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Create a new user based on role
  const newUser = new User({
    firstName,
    lastName,
    username,
    email,
    role,
    workshopIDs: role === "mentor" ? workshopIDs : undefined,
    menteeInfo: role === "mentor" ? menteeInfo : undefined,
    meetingSchedule: role === "mentee" ? meetingSchedule : undefined,
    mentorData: role === "mentee" ? mentorData : undefined,
  });

  try {
    const savedUser = await newUser.save();
    res
      .status(201)
      .json({ message: "User created successfully", user: savedUser });
  } catch (error) {
    res.status(400).json({ message: "Failed to create user", error });
  }
});

// Test route to check if the API is working
router.post("/test", async (req: any, res: any) => {
  console.log("Received group data:");
  const { name } = req.body;

  return res.status(200).json({ name });
});

export default router;
