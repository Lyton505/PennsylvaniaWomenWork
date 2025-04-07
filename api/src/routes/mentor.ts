import express from "express"
import {
  getMenteesForMentor,
  getAllMentors,
  assignMenteeToMentor,
  getMentorById,
} from "../controllers/mentorController"

const router = express.Router()

// Route to get all mentees for a mentor -- in progress
router.get("/:mentorId/mentees", getMenteesForMentor)

router.get("/all-mentors", getAllMentors)

// Assign mentee to mentor
router.put("/:mentorId/assign-mentee", assignMenteeToMentor)

router.get("/get-mentor/:mentorId", getMentorById)

export default router
