import express from "express";
import {
  getMenteesForMentor,
  assignMenteeToMentor,
} from "../controllers/mentorController";

const router = express.Router();

// Route to get all mentees for a mentor -- in progress
router.get("/:mentorId/mentees", getMenteesForMentor);

// Assign mentee to mentor
router.put("/:mentorId/assign-mentee", assignMenteeToMentor);

export default router;
