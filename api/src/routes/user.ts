import express from "express"
import mongoose from "mongoose"

const router = express.Router()

// MongoDB connection
const mongoURI = "mongodb+srv://kjgilder:2htuyRZ09zyS1m0R@pwwusers.8ssyv.mongodb.net/?retryWrites=true&w=majority&appName=PWWUsers"
mongoose.connect(mongoURI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((error) => console.error("Failed to connect to MongoDB:", error))

// User schema definition
const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  username: String,
  email: String,
  role: { type: String, enum: ["mentor", "mentee", "admin"], required: true },
  workshopIDs: [String],       // For mentors only
  menteeInfo: [String],        // For mentors only
  meetingSchedule: [String],   // For mentees only
  mentorData: String,          // For mentees only
  //pairings: [[String]]         // For admins only, array of pairs of strings
})

const User = mongoose.model("User", userSchema)

// Route to create a new user
router.post("/create-user", async (req: any, res: any) => {
  const { firstName, lastName, username, email, role, workshopIDs, menteeInfo, meetingSchedule, mentorData } = req.body;

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
    //pairings: role === "admin" ? pairings : undefined
  })

  try {
    const savedUser = await newUser.save();
    res.status(201).json({ message: "User created successfully", user: savedUser });
  } catch (error) {
    res.status(400).json({ message: "Failed to create user", error });
  }
})

export default router


// import express from "express"
//
// const router = express.Router()
// const axios = require("axios").default
//
// router.post("/create-group", async (req, res) => {
//   const { groupName, groupMembers } = req.body
//
//   console.log("Received group data:", req.body)
//
//   //   Validate request body
//   if (!groupName || !groupMembers) {
//     return res.status(400).json({
//       message: "Invalid data. Please provide group name and group members.",
//     })
//   }
//
//   // Log the received data for debugging
//   console.log("Received group data:", {
//     groupName,
//     groupMembers,
//   })
//
//   // Create a new group
//   const response = await axios.post("http://localhost:3001/api/group", {
//     groupName,
//     groupMembers,
//   })
//
//   return res.status(response.status).json(response.data)
// })
//
// export default router

