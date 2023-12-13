import express from "express";
import morgan from "morgan";

import { router as competitionRouter } from "./routes/competitionRoutes.js";

export const app = express();

app.use(express.json());
app.use(morgan("dev"));

app.use("/api/competitii", competitionRouter);

