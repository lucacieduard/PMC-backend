import express from "express";
import morgan from "morgan";
import cors from "cors";

import { router as competitionRouter } from "./routes/competitionRoutes.js";
import { router as userRouter } from "./routes/userRouter.js";

export const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("public"));

app.use("/api/competitii", competitionRouter);
app.use("/api/utilizatori", userRouter);

app.use("*", (req, res) => {
  res.status(404).json({
    status: "fail",
    message: "Route not found!",
  });
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    status: "fail",
    message: err.message,
  });
});
