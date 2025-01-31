import { Request, Response } from "express";
import { Workshop } from "../model/Workshop";

export const getWorkshopsForMentee = async (req: Request, res: Response) => {
    try {
        const { menteeId } = req.params;
        const workshops = await Workshop.find({ mentee: menteeId });
        res.status(200).json(workshops);
    } catch (error) {
       res.status(500).json({ message: "Error retrieving workshops for mentee", error });
    }
};