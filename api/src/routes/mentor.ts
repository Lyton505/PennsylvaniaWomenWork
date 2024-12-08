import express from "express";
import { getMenteesForMentor } from "../controllers/mentorController";

const router = express.Router();

// route to all mentees for a mentor getter
router.get("/:mentorId/mentees", getMenteesForMentor);

export default router;
