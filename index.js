import express from "express";

import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import storieRoutes from "./routes/story.js";
import commentRoutes from "./routes/comments.js";
import relationshipRoutes from "./routes/relationship.js";
import postRoutes from "./routes/post.js";

import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());

app.use("/api", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/stories", storieRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/relationships", relationshipRoutes);
app.use("/api/posts", postRoutes);

app.use(cookieParser());

app.listen(8000, () => {
  console.log("API funcionando na porta 8000!")
});
