import express from "express"
import {
  createEvent,
  getEventsByUser,
  deleteEvent,
  getEventsBetweenUsers,
} from "../controllers/eventController"

const router = express.Router()

// Route to create a new event
router.post("/", createEvent)

// Route to get all events for a user
router.get("/:userId", getEventsByUser)

// Add this new route
router.delete("/:eventId", deleteEvent)

router.get("meetings-between-users/:userId1/:userId2", getEventsBetweenUsers)

export default router
