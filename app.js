import express from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";

import { router as competitionRouter } from "./routes/competitionRoutes.js";
import { router as userRouter } from "./routes/userRouter.js";

export const app = express();

app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: `https://management-competitie.netlify.app`,
  })
);

app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("public"));
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.cookies);
  next();
});

app.use("/api/competitii", competitionRouter);
app.use("/api/utilizatori", userRouter);

app.use("*", (req, res) => {
  res.status(404).json({
    status: "fail",
    message: "Route not found!",
  });
});

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    status: "fail",
    message: err.message,
  });
});
