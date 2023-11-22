import { Router } from "express";
import { addStory, deleteStory, getStories } from "../controllers/story.js";

const router = Router();

router.get("/", getStories);
router.post("/", addStory);
router.delete("/:storieId", deleteStory)

export default router;