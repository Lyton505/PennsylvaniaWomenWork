import { Request, Response } from "express";
import { Mentor } from "../model/Mentor";
import User from "../model/User";

// Get all mentees and their workshops for a given mentor
export const getMenteesForMentor = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { mentorId } = req.params;

    const mentor = await User.findById(mentorId);
    if (!mentor || mentor.role !== "mentor") {
      res.status(404).json({ message: "Mentor not found or invalid role" });
      return;
    }

    const menteeIds = mentor.menteeInfo;

    const mentees = await User.find({
      _id: { $in: menteeIds },
      role: "mentee",
    });

    res.status(200).json(mentees);
  } catch (error) {
    console.error("Error in getAllMenteesForMentor:", error);
    res.status(500).json({ message: "An error occurred", error });
  }
};
