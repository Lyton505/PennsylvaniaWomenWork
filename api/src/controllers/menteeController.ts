import { Request, Response } from "express";
import { Workshop } from "../model/Workshop";
import { Mentee } from "../model/Mentee";

export const getWorkshopsForMentee = async (req: Request, res: Response) => {
  try {
    const { menteeId } = req.params;
    const workshops = await Workshop.find({ mentee: menteeId });
    res.status(200).json(workshops);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving workshops for mentee", error });
  }
};

export const addWorkshopToMentee = async (req: Request, res: Response) => {
  const { menteeId } = req.params;
  const { workshopId } = req.body;

  if (!menteeId || !workshopId) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const updatedMentee = await Mentee.findByIdAndUpdate(
      menteeId,
      { $push: { workshops: workshopId } },
      { new: true, safe: true, upsert: false },
    );

    if (!updatedMentee) {
      return res.status(404).send("Mentee not found");
    }
    res.json(updatedMentee);
  } catch (error) {
    res.status(500).send((error as Error).toString());
  }
};
