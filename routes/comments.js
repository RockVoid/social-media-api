import Router from "express";
import { getComments, addComment, deleteComment } from "../controllers/comment.js";

const router = Router();

router.get("/", getComments);
router.post("/", addComment);
router.delete("/:id", deleteComment)

export default router;