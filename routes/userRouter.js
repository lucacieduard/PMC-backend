import express from "express";
import {
  forgotPassword,
  login,
  logout,
  persist,
  protect,
  resetPassword,
  restrictTo,
  signup,
} from "../controllers/authController.js";
import {
  deleteUser,
  getAllUsers,
  updateUser,
} from "../controllers/userController.js";

export const router = express.Router();

router.post("/creeaza-cont", signup);
router.post("/autentificare", login);
router.get("/persistLogin", persist);
router.get("/deconectare", logout);
router.post("/forgotPassword", forgotPassword);
router.patch("/reseteazaParola/:token", resetPassword);

router.get("/", protect, restrictTo("admin"), getAllUsers);
router
  .delete("/:id", protect, restrictTo("admin"), deleteUser)
  .patch("/:id", protect, restrictTo("admin"), updateUser);
