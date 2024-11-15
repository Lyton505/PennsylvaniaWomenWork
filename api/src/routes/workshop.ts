import express from "express";
import mongoose from "mongoose";
import dbConnect from "../config/db"; // Import the dbConnect function

const router = express.Router()

// Call the dbConnect function to connect to MongoDB
dbConnect();

// Workshop schema definition (name (required by user), description (required by user), and S3 bucket ID (not required as user input))
const workshopSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  s3id: { type: String, required: false },
})

const Workshop = mongoose.model("Workshop", workshopSchema)

// Route to create a new workshop
router.post("/create-workshop", async (req: any, res: any) => {
  const { name, description, s3id } = req.body

  if (!name || !description ) {
    return res.status(400).json({ message: "Missing required fields" })
  }

  try {
    // Create a new workshop with
    const newWorkshop = new Workshop({ name, description, s3id })
    const savedWorkshop = await newWorkshop.save()

    // Success:
    res.status(201).json({
      message: "Workshop created successfully",
      workshop: savedWorkshop,
    })

  } catch (error) {
    console.error("Error saving workshop:", error)
    res.status(500).json({ message: "Failed to create workshop", error })
  }
});

// router.get(
//     "/workshops/:id",
//     async (req: express.Request, res: express.Response) => {
//       await getWorkshop(req, res)
//     }
// )

export default router

