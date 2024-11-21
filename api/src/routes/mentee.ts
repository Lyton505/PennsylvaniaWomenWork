import express from "express";
import Workshop from "../model/Workshop";

const router = express.Router();

// Route to get all workshops for a specific mentee
router.get("/:menteeId/workshops", async (req, res) => {
  try {
    const { menteeId } = req.params;
    const workshops = await Workshop.find({ mentee: menteeId });
    res.status(200).json(workshops);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving workshops for mentee", error });
  }
});

export default router;
