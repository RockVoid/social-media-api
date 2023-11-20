import { Router } from "express";
import { addRelationship, getRelationships, deleteRelationships } from "../controllers/relationship.js";

const router = Router();

router.get("/", getRelationships);
router.post("/", addRelationship);
router.delete("/", deleteRelationships)

export default router;