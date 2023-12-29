import express from "express";
import {
  getAllCompetitions,
  getCompetition,
  addCompetition,
  deleteCompetition,
  updateProba,
  updateCompetition,
} from "../controllers/competitionController.js";

export const router = express.Router();

router.get("/", getAllCompetitions);
router.post("/", addCompetition);

router.get("/:id", getCompetition);
router.delete("/:id", deleteCompetition).patch("/:id", updateCompetition);
router.patch("/:id/:categoryId/:probaId", updateProba);
