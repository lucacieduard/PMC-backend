import express from "express";
import {
  getAllCompetitions,
  getCompetition,
  addCompetition,
  deleteCompetition,
  updateProba,
  updateCompetition,
  uploadBanner,
  resizeUserPhoto,
} from "../controllers/competitionController.js";

export const router = express.Router();

router.get("/", getAllCompetitions);
router.post("/", addCompetition);

router.get("/:id", getCompetition);
router
  .delete("/:id", deleteCompetition)
  .patch("/:id", uploadBanner, resizeUserPhoto, updateCompetition);
router.patch("/:id/:categoryId/:probaId", updateProba);
