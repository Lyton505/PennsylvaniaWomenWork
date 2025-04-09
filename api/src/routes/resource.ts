import express from "express";
import {
  createResource,
  getResourcesByWorkshopId,
  getResourcesByBoardFileId,
  generateRetrievalURL,
  deleteResource,
  deleteResourcesByWorkshopId,
  getAllTags,
} from "../controllers/resourceController";

const router = express.Router();

// Route to create a resource -- wired
router.post("/create-resource", createResource);

// Route to get resources by workshop ID -- not wired
router.get("/get-resource-by-workshop/:workshopId", getResourcesByWorkshopId);

router.get("/get-resource-by-board-file/:boardFileID", getResourcesByBoardFileId);

router.get("/getURL/:objectId", generateRetrievalURL);

router.delete("/delete-resource/:objectId", deleteResource);

router.delete("/delete-resources/:workshopId", deleteResourcesByWorkshopId);

router.get("/all-tags", getAllTags);
export default router;
