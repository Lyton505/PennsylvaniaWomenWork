import { Request, Response } from "express";
import User from "../model/User";

export const updateUser = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const allowedFields = [
    "firstName",
    "lastName",
    "username",
    "email",
    "role",
    "workshopIDs",
    "menteeInfo",
    "meetingSchedule",
    "mentorData",
    "meetings",
  ];

  try {
    const updateData: Partial<typeof User> = {};
    Object.keys(req.body).forEach((key) => {
      if (allowedFields.includes(key)) {
        updateData[key as keyof typeof updateData] = req.body[key];
      }
    });

    if (Object.keys(updateData).length === 0) {
      return res
        .status(400)
        .json({ message: "No valid fields provided for update" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }, // Return updated document and validate
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({
      message: "Error updating user",
      error,
    });
  }
};
