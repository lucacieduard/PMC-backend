import catchAsync from "../utils/catchAsync.js";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import AppError from "../utils/appError.js";
import { promisify } from "util";

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
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

  const token = signToken(newUser._id);
  res.cookie("jwt", token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 60 * 60 * 1000 * 24
    ),
    httpOnly: true,
  });
  res.status(200).json({
    status: "success",
    newUser: {
      id: newUser._id,
      nume: newUser.nume,
      prenume: newUser.prenume,
      email: newUser.email,
      telefon: newUser.telefon,
      clubSportiv: newUser.clubSportiv,
      role: newUser.role,
    },
  });
});

// LOGIN
export const login = catchAsync(async (req, res, next) => {
  const { email, parola } = req.body;
  //1) Verificăm dacă email-ul și parola există
  if (!email || !parola) {
    return next(new AppError("Email-ul și parola sunt obligatorii!", 400));
  }
  //2) Verificăm dacă utilizatorul există și parola este corectă
  const user = await User.findOne({ email }).select("+parola");
  if (!user || !(await user.correctPassword(parola, user.parola))) {
    return next(new AppError("Email-ul sau parola sunt incorecte!", 401));
  }
  //3) Dacă totul este ok, trimitem token-ul către client
  const token = signToken(user._id);
  res.cookie("jwt", token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 60 * 60 * 1000 * 24
    ),
    httpOnly: true,
  });

  res.status(200).json({
    status: "success",
    user: {
      id: user._id,
      nume: user.nume,
      prenume: user.prenume,
      email: user.email,
      telefon: user.telefon,
      clubSportiv: user.clubSportiv,
      role: user.role,
    },
  });
});

export const protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) {
    return next(
      new AppError(
        "Nu ai dreptul să accesezi această resursă! Te rugăm să te autentifici!",
        401
      )
    );
  }

  // 2) Verificăm token-ul
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // 3) Verificăm dacă utilizatorul există
  const user = await User.findById(decoded.id);
  if (!user) return next(new AppError("Utilizatorul nu mai există!", 401));
  if (user.parolaSchimbata(decoded.iat))
    return next(
      new AppError(
        "Parola a fost schimbată recent! Te rugăm să te autentifici din nou!",
        401
      )
    );
  req.user = user;
  next();
});

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles ["admin", "user"]
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("Nu ai dreptul să faci aceasta operatiune!", 403)
      );
    }
    next();
  };
};

export const persist = catchAsync(async (req, res, next) => {
  let token;
  if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) {
    res.status(200).json({
      status: "success",
      user: null,
    });
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // 3) Verificăm dacă utilizatorul există
  const user = await User.findById(decoded.id);
  if (!user) return next(new AppError("Utilizatorul nu mai există!", 401));
  if (user.parolaSchimbata(decoded.iat))
    return next(
      new AppError(
        "Parola a fost schimbată recent! Te rugăm să te autentifici din nou!",
        401
      )
    );

  res.status(200).json({
    status: "success",
    user: user,
  });
});

export const logout = (req, res) => {
  res.clearCookie("jwt");
  res.status(200).json({
    status: "success",
  });
};
