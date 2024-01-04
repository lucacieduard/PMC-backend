import catchAsync from "../utils/catchAsync.js";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

// SIGNUP
export const signup = catchAsync(async (req, res) => {
  const newUser = await User.create({
    nume: req.body.nume,
    prenume: req.body.prenume,
    email: req.body.email,
    telefon: req.body.telefon,
    clubSportiv: req.body.clubSportiv,
    parola: req.body.parola,
  });

  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  res.status(200).json({
    status: "success",
    token,
    data: {
      newUser,
    },
  });
});


