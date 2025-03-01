import express from "express";
import { Workshop } from "../model/Workshop";
import {
  getWorkshopsForMentee,
  addWorkshopToMentee,
  getMenteeById,
} from "../controllers/menteeController";
import { get } from "http";

const router = express.Router();

// Route to get all workshops for a specific mentee -- assigned
router.get(":menteeId/workshops", getWorkshopsForMentee);

// Route to add a workshop to a mentee -- assigned
router.patch("/:menteeId/add-workshop", addWorkshopToMentee);

router.get("/get-mentee/:menteeId", getMenteeById);

export default router;
