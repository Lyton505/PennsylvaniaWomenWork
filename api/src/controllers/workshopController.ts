import { Request, Response } from "express";
import { Workshop } from "../model/Workshop";

export const createWorkshop = async (req: Request, res: Response) => {
  const { name, description, s3id } = req.body;

  if (!name || !description) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // Create a new workshop with
    const newWorkshop = new Workshop({ name, description, s3id });
    const savedWorkshop = await newWorkshop.save();

    // Success:
    res.status(201).json({
      message: "Workshop created successfully",
      workshop: savedWorkshop,
    });
  } catch (error) {
    console.error("Error saving workshop:", error);
    res.status(500).json({ message: "Failed to create workshop", error });
  }
};

export const getWorkshop = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const workshop = await Workshop.findById(id);

    if (!workshop) {
      return res.status(404).json({ message: "Workshop not found" });
    }

    res.status(200).json(workshop);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving workshop", error });
  }
};

export const getWorkshopsByUserId = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const workshops = await Workshop.find({
      $or: [{ mentor: userId }, { mentee: userId }],
    });

    if (workshops.length === 0) {
      return res
        .status(404)
        .json({ message: "No workshops found for this user" });
    }

    res.status(200).json(workshops);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving workshops", error });
  }
};
