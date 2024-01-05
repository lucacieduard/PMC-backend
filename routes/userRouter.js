import express from "express";
import {
  login,
  logout,
  persist,
  protect,
  signup,
} from "../controllers/authController.js";

export const router = express.Router();

router.post("/creeaza-cont", signup);
router.post("/autentificare", login);
router.get("/persistLogin", protect, persist);
router.get("/deconectare", logout);
