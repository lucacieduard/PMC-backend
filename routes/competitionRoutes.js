import express from "express";
import {
  getAllCompetitions,
  getCompetition,
} from "../controllers/competitionController.js";

export const router = express.Router();

router.get("/", getAllCompetitions);
router.get("/:id", getCompetition);
