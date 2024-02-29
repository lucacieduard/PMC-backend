import catchAsync from "../utils/catchAsync.js";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import AppError from "../utils/appError.js";
import { promisify } from "util";
import { sendEmail } from "../utils/email.js";
import crypto from "crypto";

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
    secure: process.env.NODE_ENV === "production" ? true : false,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
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
    secure: process.env.NODE_ENV === "production" ? true : false,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
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
    return res.status(200).json({
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
  res.clearCookie("jwt", {
    
    domain:
      process.env.NODE_ENV === "production"
        ? "pmc-backend-v8pz.onrender.com"
        : "localhost",
  });
  res.status(200).json({
    status: "success",
  });
};

export const forgotPassword = catchAsync(async (req, res, next) => {
  //1 Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new AppError("Nu exista niciun utilizator cu acest email", 404)
    );
  }
  //2 Gnereate the random reset token

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  //3 Send it to user's email
  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/utilizatori/reseteazaParola/${resetToken}`;

  const message = `Ai uitat parola? Acceseaza acest link: ${resetURL}.\nDaca nu ai uitat parola, te rugam ignora acest email!`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Link-ul pentru resetarea parolei (valabil 10 minute)",
      message,
    });
  } catch (error) {
    user.tokenResetParola = undefined;
    user.tokenResetParolaExpire = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        "A aparut o eroare la trimiterea email-ului! Incearca din nou mai tarziu!",
        500
      )
    );
  }

  res.status(200).json({
    status: "success",
    message: "Link-ul pentru resetarea parolei a fost trimis pe email!",
  });
});

export const resetPassword = catchAsync(async (req, res, next) => {
  //1 Get user based on the token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    tokenResetParola: hashedToken,
    tokenResetParolaExpire: { $gt: Date.now() },
  });
  //2 If token has not expired, and there is user, set the new password
  if (!user) {
    return next(new AppError("Token-ul este invalid sau a expirat!", 400));
  }

  user.parola = req.body.parola;
  user.tokenResetParola = undefined;
  user.tokenResetParolaExpire = undefined;

  await user.save();

  //3 Update changedPasswordAt property for the user

  res.status(200).json({
    status: "success",
  });
});

export const updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id).select("+parola");
  //2 Check if POSTed current password is correct
  const result = await user.correctPassword(req.body.parolaVeche, user.parola);
  if (!result) {
    return next(new AppError("Parola actuala este incorecta!", 401));
  }
  //3 If so, update password
  user.parola = req.body.parolaNoua;
  await user.save();
  //4 Log user in, send JWT
  const token = signToken(user._id);
  res
    .cookie("jwt", token, {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 60 * 60 * 1000 * 24
      ),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    })
    .status(200)
    .json({
      status: "success",
      message: "Parola a fost actualizata cu succes!",
    });
});
