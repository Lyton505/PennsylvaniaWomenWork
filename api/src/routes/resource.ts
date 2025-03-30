import express from "express";
import {
  createResource,
  getResourcesByWorkshopId,
  generateRetrievalURL,
  deleteResource,
  deleteResourcesByWorkshopId
} from "../controllers/resourceController";

const router = express.Router();

// Route to create a resource -- wired
router.post("/create-resource", createResource);

// Route to get resources by workshop ID -- not wired
router.get("/workshop/:workshopId/resources", getResourcesByWorkshopId);

router.get("/getURL/:objectId", generateRetrievalURL);

router.delete("/delete-resource/:objectId", deleteResource);

router.delete("/delete-resources/:workshopId", deleteResourcesByWorkshopId);
export default router;
