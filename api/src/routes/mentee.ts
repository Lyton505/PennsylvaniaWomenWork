import express from "express";
import { Workshop } from "../model/Workshop";
import { getWorkshopsForMentee } from "../controllers/menteeController";

const router = express.Router();

// Route to get all workshops for a specific mentee
router.get(":menteeId/workshops", getWorkshopsForMentee);

export default router;
