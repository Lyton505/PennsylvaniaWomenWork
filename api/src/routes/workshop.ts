import express from "express";
import {
  createWorkshop,
  getWorkshop,
  getWorkshopsByUserId,
  generatePresignedUrl,
  deleteWorkshop,
} from "../controllers/workshopController";

const router = express.Router();

// Route to create a workshop
router.post("/create-workshop", createWorkshop);

// Route to get a specific workshop -- not wired
router.get("/:id", getWorkshop);

// Route to get workshops by user ID -- not wired
router.get("/user/:userId", getWorkshopsByUserId);

// Route to generate a presigned URL for S3
router.get("/generate-presigned-url/:file_name", generatePresignedUrl);

router.delete("/delete-workshop/:id", deleteWorkshop);

export default router;
