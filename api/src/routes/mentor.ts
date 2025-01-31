import express from "express";
import { getMenteesForMentor } from "../controllers/mentorController";

const router = express.Router();

// Route to get all mentees for a mentor
router.get("/:mentorId/mentees", getMenteesForMentor);

export default router;
