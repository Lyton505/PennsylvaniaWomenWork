import { Request, Response } from "express";
import { Event } from "../model/Event";

export const createEvent = async (req: Request, res: Response) => {
  try {
    const { name, description, date, userIds, calendarLink } = req.body;

    const newEvent = new Event({
      name,
      description,
      date,
      users: userIds,
      calendarLink,
    });

    const savedEvent = await newEvent.save();

    res
      .status(201)
      .json({ message: "Event created successfully", event: savedEvent });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ message: "Error creating event", error });
  }
};

export const getEventsByUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const events = await Event.find({ user: userId });

    if (!events.length) {
      return res.status(404).json({ message: "No events found for this user" });
    }

    res.status(200).json(events);
  } catch (error) {
    console.error("Error retrieving events:", error);
    res.status(500).json({ message: "Error retrieving events", error });
  }
};
