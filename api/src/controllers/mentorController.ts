import { Request, Response } from "express";
import { Mentor } from "../model/Mentor";

// Get all mentees and their workshops for a given mentor
export const getMenteesForMentor = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { mentorId } = req.params;

    // Find the mentor, populate mentees, and include mentee workshops
    const mentor = await Mentor.findById(mentorId)
      .populate({
        path: "mentees",
        populate: { path: "workshops" }, // workshops for each mentee
      })
      .populate("workshops"); // workshops for the mentor

    if (!mentor) {
      return;
    }

    res.status(200).json({
      mentees: mentor.mentees,
      workshops: mentor.workshops,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred", error });
  }
};
