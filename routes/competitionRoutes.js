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
import { protect, restrictTo } from "../controllers/authController.js";

export const router = express.Router();

router.get("/", getAllCompetitions);
router.post("/", protect, restrictTo("admin"), addCompetition);

router.get("/:id", getCompetition);
router
  .delete("/:id", protect, restrictTo("admin"), deleteCompetition)
  .patch("/:id", uploadBanner, resizeUserPhoto, updateCompetition);
router.patch("/:id/:categoryId/:probaId", updateProba);
