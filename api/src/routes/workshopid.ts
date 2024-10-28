import express from "express"
import mongoose from "mongoose"

const router = express.Router()

// MongoDB connection
const mongoURI = "mongodb+srv://kjgilder:2htuyRZ09zyS1m0R@pwwusers.8ssyv.mongodb.net/?retryWrites=true&w=majority&appName=PWWUsers"
mongoose.connect(mongoURI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((error) => console.error("Failed to connect to MongoDB:", error))

// Workshop schema definition (name and S3 bucket ID)
const workshopIDSchema = new mongoose.Schema({
  name: String,
  s3ID: String
})

const WorkshopID = mongoose.model("WorkshopID", workshopIDSchema)

// Route to create a new workshop
router.post("/create-workshopID", async (req: any, res: any) => {
  const { name, s3ID } = req.body;

  if (!name || !s3ID ) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Create a new workshop
  const newWorkshop = new WorkshopID({
    name,
    s3ID
  })

  try {
    const savedWorkshop = await newWorkshop.save();
    res.status(201).json({ message: "Workshop created successfully", WorkshopID: savedWorkshop });
  } catch (error) {
    res.status(400).json({ message: "Failed to create workshop", error });
  }
})

export default router