import express from "express";

import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());

app.use("/api", authRoutes);
app.use("/api/users", userRoutes)

app.use(cookieParser());

app.listen(8000, () => {
  console.log("API funcionando na porta 8000!")
});
