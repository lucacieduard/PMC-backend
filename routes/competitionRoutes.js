import express from "express";
import {
  getAllCompetitions,
  getCompetition,
  addCompetition,
  deleteCompetition,
} from "../controllers/competitionController.js";

export const router = express.Router();

router.get("/", getAllCompetitions);
router.post("/", addCompetition);

router.get("/:id", getCompetition);
router.delete("/:id", deleteCompetition);
