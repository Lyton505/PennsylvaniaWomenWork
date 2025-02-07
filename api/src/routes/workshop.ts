import express from "express";
import mongoose from "mongoose";
import {
  createWorkshop,
  getWorkshop,
  getWorkshopsByUserId,
} from "../controllers/workshopController";

const router = express.Router();

// Route to create a workshop
router.post("/create-workshop", createWorkshop);

// Route to get a specific workshop
// router.get("/workshops/:id", getWorkshop);
router.get("/:id", getWorkshop);

// Route to get workshops by user ID
// router.get("/workshops/user/:userId", getWorkshopsByUserId);
router.get("/user/:userId", getWorkshopsByUserId);

export default router;
