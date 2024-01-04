import express from "express";
import { signup } from "../controllers/authController.js";

export const router = express.Router();

router.post("/creeaza-cont", signup);
